#!/usr/bin/env python3
"""Build the section-oriented mobile database for Ikhteyarate Mustafa."""

from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
BOOK_DIR = ROOT / "publishing" / "ikhteyarate-mustafa-english"
SOURCE_JSON = ROOT / "content" / "books" / "ikhteyarate-mustafa.json"
HINDI_MANUSCRIPT = ROOT / "publishing" / "ikhteyarate-mustafa-hindi" / "manuscript" / "01-ikhteyarate-mustafa.md"
ENGLISH_MANUSCRIPT = BOOK_DIR / "manuscript"
ENGLISH_TITLE_PAGE = BOOK_DIR / "layout" / "title-page.md"
DATABASE = BOOK_DIR / "database" / "ikhteyarate-mustafa-mobile.db"

# Each English manuscript chapter covers these consecutive source sections.
ENGLISH_SECTION_GROUPS = [
    [1], [2], [3], [4], [5], [6], [7, 8, 9], [10, 11, 12], [13, 14, 15], [16]
]


def markdown_sections(text: str) -> list[tuple[str, str]]:
    """Split Markdown at level-one or level-two headings, retaining each heading."""
    matches = list(re.finditer(r"(?m)^#{1,2} .+$", text))
    result = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        block = text[match.start():end].strip()
        title = match.group(0).lstrip("# ").strip()
        result.append((title, block))
    return result


def source_ranges(source_sections: list[dict], indices: list[int]) -> dict:
    selected = [source_sections[index - 1] for index in indices]
    printed_starts = [item["startPrintedPage"] for item in selected if item.get("startPrintedPage") is not None]
    printed_ends = [item["endPrintedPage"] for item in selected if item.get("endPrintedPage") is not None]
    return {
        "source_section_start": min(indices),
        "source_section_end": max(indices),
        "source_page_start": min(item["startPdfPage"] for item in selected),
        "source_page_end": max(item["endPdfPage"] for item in selected),
        "printed_page_start": min(printed_starts) if printed_starts else 1,
        "printed_page_end": max(printed_ends) if printed_ends else 1,
    }


def section_row(ordinal: int, slug: str, title: str, content: str, content_format: str,
                indices: list[int] | None, source_sections: list[dict]) -> dict:
    ranges = source_ranges(source_sections, indices) if indices else {
        "source_section_start": None,
        "source_section_end": None,
        "source_page_start": 1,
        "source_page_end": 6,
        "printed_page_start": 1,
        "printed_page_end": 1,
    }
    return {
        "ordinal": ordinal,
        "slug": slug,
        "title": title,
        "content": content.strip(),
        "content_format": content_format,
        **ranges,
    }


def main() -> None:
    source = json.loads(SOURCE_JSON.read_text(encoding="utf-8"))
    source_sections = source["sections"]
    if len(source_sections) != 16:
        raise ValueError(f"Expected 16 source sections, found {len(source_sections)}")

    # Roman Urdu: retain the complete logical source sections and extracted front matter.
    roman_front = "\n\n".join(
        page["text"].strip() for page in source.get("frontMatter", []) if page["text"].strip()
    )
    roman_rows = [section_row(0, "front-matter", "Front Matter", roman_front, "text", None, source_sections)]
    for number, item in enumerate(source_sections, 1):
        blocks = sorted(item.get("blocks", []), key=lambda block: block["sequenceNo"])
        body = "\n\n".join(block["text"].strip() for block in blocks if block.get("text", "").strip())
        roman_rows.append(section_row(number, item["slug"], item["title"], body, "text", [number], source_sections))

    # Hindi: preserve the existing manuscript, but omit the editorial draft label.
    hindi_text = HINDI_MANUSCRIPT.read_text(encoding="utf-8").replace("\r\n", "\n")
    hindi_text = hindi_text.replace("Manual Hindi/Devanagari transliteration draft.\n", "")
    hindi_blocks = markdown_sections(hindi_text)
    if len(hindi_blocks) != 18:
        raise ValueError(f"Expected Hindi title, contents, and 16 sections; found {len(hindi_blocks)} headings")
    hindi_front = "\n\n".join([hindi_blocks[0][1], hindi_blocks[1][1]])
    hindi_rows = [section_row(0, "front-matter", "प्रारंभिक पृष्ठ", hindi_front, "markdown", None, source_sections)]
    hindi_chapters = hindi_blocks[2:]
    if len(hindi_chapters) != len(source_sections):
        raise ValueError("Hindi manuscript headings do not align with the 16 source sections")
    for number, ((title, content), source_section) in enumerate(zip(hindi_chapters, source_sections), 1):
        hindi_rows.append(section_row(number, source_section["slug"], title, content, "markdown", [number], source_sections))

    # English: preserve chapter text while aligning chapter headings to source sections.
    english_rows = [section_row(0, "front-matter", "Title Page", ENGLISH_TITLE_PAGE.read_text(encoding="utf-8"), "markdown", None, source_sections)]
    english_files = sorted(ENGLISH_MANUSCRIPT.glob("*.md"))
    if len(english_files) != len(ENGLISH_SECTION_GROUPS):
        raise ValueError(f"Expected {len(ENGLISH_SECTION_GROUPS)} English chapter files, found {len(english_files)}")
    english_chapters = []
    for path in english_files:
        english_chapters.extend(markdown_sections(path.read_text(encoding="utf-8").replace("\r\n", "\n")))
    if len(english_chapters) != len(source_sections):
        raise ValueError(f"Expected 16 English section headings, found {len(english_chapters)}")
    if sum(len(group) for group in ENGLISH_SECTION_GROUPS) != len(english_chapters):
        raise ValueError("English chapter-to-source mapping does not cover all section headings")
    cursor = 0
    for group in ENGLISH_SECTION_GROUPS:
        for source_index in group:
            title, content = english_chapters[cursor]
            english_rows.append(section_row(source_index, source_sections[source_index - 1]["slug"], title,
                                            content, "markdown", [source_index], source_sections))
            cursor += 1

    editions = [
        ("roman-urdu", "Roman Urdu", source["title"], "complete", str(SOURCE_JSON.relative_to(ROOT)), roman_rows),
        ("hindi", "Hindi", "इख़्तियाराते मुस्तफ़ा ﷺ", "draft", str(HINDI_MANUSCRIPT.relative_to(ROOT)), hindi_rows),
        ("english", "English", "The Power of the Last Prophet ﷺ", "draft", str(ENGLISH_MANUSCRIPT.relative_to(ROOT)), english_rows),
    ]

    DATABASE.parent.mkdir(parents=True, exist_ok=True)
    if DATABASE.exists():
        DATABASE.unlink()
    connection = sqlite3.connect(DATABASE)
    try:
        connection.execute("PRAGMA foreign_keys = ON")
        connection.executescript("""
            CREATE TABLE book (
                book_id INTEGER PRIMARY KEY,
                slug TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                source_page_count INTEGER NOT NULL
            );
            CREATE TABLE editions (
                edition_id INTEGER PRIMARY KEY,
                book_id INTEGER NOT NULL REFERENCES book(book_id) ON DELETE CASCADE,
                edition_key TEXT NOT NULL,
                language TEXT NOT NULL,
                display_title TEXT NOT NULL,
                status TEXT NOT NULL CHECK (status IN ('complete', 'draft')),
                source_path TEXT NOT NULL,
                UNIQUE (book_id, edition_key)
            );
            CREATE TABLE sections (
                section_id INTEGER PRIMARY KEY,
                edition_id INTEGER NOT NULL REFERENCES editions(edition_id) ON DELETE CASCADE,
                ordinal INTEGER NOT NULL,
                slug TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                content_format TEXT NOT NULL CHECK (content_format IN ('text', 'markdown')),
                source_section_start INTEGER,
                source_section_end INTEGER,
                source_page_start INTEGER NOT NULL,
                source_page_end INTEGER NOT NULL,
                printed_page_start INTEGER NOT NULL,
                printed_page_end INTEGER NOT NULL,
                UNIQUE (edition_id, ordinal),
                UNIQUE (edition_id, slug)
            );
            CREATE INDEX sections_edition_order ON sections (edition_id, ordinal);
        """)
        connection.execute(
            "INSERT INTO book (slug, title, author, source_page_count) VALUES (?, ?, ?, ?)",
            (source["slug"], source["title"], source["author"], source["pageCount"]),
        )
        book_id = connection.execute("SELECT book_id FROM book").fetchone()[0]
        for key, language, title, status, source_path, rows in editions:
            cursor = connection.execute(
                "INSERT INTO editions (book_id, edition_key, language, display_title, status, source_path) VALUES (?, ?, ?, ?, ?, ?)",
                (book_id, key, language, title, status, source_path),
            )
            edition_id = cursor.lastrowid
            connection.executemany("""
                INSERT INTO sections (
                    edition_id, ordinal, slug, title, content, content_format,
                    source_section_start, source_section_end,
                    source_page_start, source_page_end,
                    printed_page_start, printed_page_end
                ) VALUES (
                    :edition_id, :ordinal, :slug, :title, :content, :content_format,
                    :source_section_start, :source_section_end,
                    :source_page_start, :source_page_end,
                    :printed_page_start, :printed_page_end
                )
            """, [{"edition_id": edition_id, **row} for row in rows])
        connection.commit()
        integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
        foreign_keys = connection.execute("PRAGMA foreign_key_check").fetchall()
        counts = connection.execute("SELECT e.edition_key, COUNT(s.section_id) FROM editions e JOIN sections s USING (edition_id) GROUP BY e.edition_key ORDER BY e.edition_key").fetchall()
        if integrity != "ok" or foreign_keys:
            raise RuntimeError(f"SQLite validation failed: integrity={integrity}, foreign_keys={foreign_keys}")
        print(f"Created {DATABASE.relative_to(ROOT)}")
        print(f"SQLite integrity: {integrity}; foreign-key violations: {len(foreign_keys)}")
        for key, count in counts:
            print(f"{key}: {count} sections (including front matter)")
    finally:
        connection.close()


if __name__ == "__main__":
    main()
