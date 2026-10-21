"""Build a section-oriented two-edition SQLite database for the mobile app."""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
PROJECT = ROOT / "publishing" / "addawatul-makkiyyah-english-json"
SOURCE_JSON = ROOT / "content" / "books" / "addawatul-makkiyyah.json"
OUTPUT = PROJECT / "database" / "addawatul-makkiyyah-mobile.db"

# English entries are the independent translation sections completed so far.
ENGLISH_SECTIONS = [
    ("opening-01", "Opening Discussion and First View", "manuscript/01-opening/01-pages-13-17.md", 13, 17),
    ("opening-02", "The First Discussion: Knowledge of the Unseen", "manuscript/02-opening/02-pages-18-27-partial.md", 18, 27),
    ("opening-03", "First View Conclusion and Second View", "manuscript/03-opening/03-end-of-first-view-and-second-view.md", 27, 31),
    ("nazre-siwum", "The Third View", "manuscript/04-nazre-siwum/04-nazre-siwum.md", 31, 38),
    ("nazre-chaharum", "The Fourth View", "manuscript/05-nazre-chaharum/05-nazre-chaharum.md", 38, 44),
    ("nazre-panjum", "The Fifth View", "manuscript/06-nazre-panjum/06-nazre-panjum.md", 45, 62),
    ("five-things", "The Sixth View: Knowledge of Five Matters", "manuscript/07-nazre-shashum/01-five-things.md", 63, 65),
    ("wisdom-five", "The Wisdom Behind the Exclusivity of Five Matters", "manuscript/07-nazre-shashum/02-wisdom-five-things.md", 66, 71),
    ("meri-guzarish", "My Request", "manuscript/07-nazre-shashum/03-meri-guzarish.md", 71, 75),
    ("maut-hayaat", "Knowledge of Life and Death", "manuscript/07-nazre-shashum/04-knowledge-of-life-and-death.md", 75, 76),
    ("aakhiri-guzarish", "A Final Request", "manuscript/07-nazre-shashum/05-aakhiri-guzarish.md", 76, 77),
    ("ummatiyon-ghuyoob", "Gifts of the Unseen to the Prophet’s Ummah", "manuscript/07-nazre-shashum/06-gifts-of-the-unseen-to-the-ummah.md", 77, 84),
    ("bahjatul-asraar", "Bahjat-ul-Asrar and Its Author", "manuscript/08-bahjatul-asraar/08-bahjatul-asraar.md", 84, 89),
    ("kis-zameen", "Where Will the Passing Take Place?", "manuscript/09-kis-zameen/09-kis-zameen-par-inteqal.md", 89, 90),
    ("yusuf-lauh", "The Knowledge of Sayyiduna Yusuf and the Preserved Tablet", "manuscript/10-yusuf-lauh-mahfooz/10-yusuf-lauh-mahfooz.md", 90, 98),
]


def section_content(section: dict) -> str:
    """Join layout-aware Roman Urdu blocks in source sequence."""
    blocks = sorted(section.get("blocks", []), key=lambda block: block["sequenceNo"])
    return "\n\n".join(block.get("text", "").strip() for block in blocks if block.get("text", "").strip())


def english_title(markdown: str, fallback: str) -> str:
    for line in markdown.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def main() -> None:
    source = json.loads(SOURCE_JSON.read_text(encoding="utf-8"))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    if OUTPUT.exists():
        OUTPUT.unlink()

    db = sqlite3.connect(OUTPUT)
    try:
        db.execute("PRAGMA foreign_keys = ON")
        db.execute("PRAGMA journal_mode = DELETE")
        db.executescript(
            """
            PRAGMA user_version = 2;
            CREATE TABLE book (
                book_id INTEGER PRIMARY KEY,
                slug TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                author TEXT
            );
            CREATE TABLE editions (
                edition_id INTEGER PRIMARY KEY,
                book_id INTEGER NOT NULL REFERENCES book(book_id),
                name TEXT NOT NULL,
                status TEXT NOT NULL,
                sort_order INTEGER NOT NULL,
                UNIQUE(book_id, name)
            );
            CREATE TABLE sections (
                section_id INTEGER PRIMARY KEY,
                edition_id INTEGER NOT NULL REFERENCES editions(edition_id),
                sort_order INTEGER NOT NULL,
                slug TEXT NOT NULL,
                title TEXT NOT NULL,
                json_page_start INTEGER,
                json_page_end INTEGER,
                printed_page_start INTEGER,
                printed_page_end INTEGER,
                content_format TEXT NOT NULL CHECK(content_format IN ('text','markdown')),
                content TEXT NOT NULL,
                UNIQUE(edition_id, slug)
            );
            CREATE INDEX sections_edition_order ON sections(edition_id, sort_order);
            """
        )

        book_id = db.execute(
            "INSERT INTO book(slug,title,author) VALUES(?,?,?)",
            (source["slug"], source["title"], source.get("author")),
        ).lastrowid
        roman_id = db.execute(
            "INSERT INTO editions(book_id,name,status,sort_order) VALUES(?,?,?,?)",
            (book_id, "Roman Urdu", "complete", 1),
        ).lastrowid
        english_id = db.execute(
            "INSERT INTO editions(book_id,name,status,sort_order) VALUES(?,?,?,?)",
            (book_id, "English", "in progress", 2),
        ).lastrowid

        pages_by_no = {int(p["pdfPage"]): p for p in source["pageMap"]}

        # Schema v2 stores a page manifest, not extracted front-matter text.
        # Keep the front-matter row for app compatibility without inventing content.
        db.execute(
            """INSERT INTO sections
               (edition_id,sort_order,slug,title,json_page_start,json_page_end,
                printed_page_start,printed_page_end,content_format,content)
               VALUES(?,?,?,?,?,?,?,?,?,?)""",
            (roman_id, 1, "front-matter", "Front Matter", 1, source.get("frontMatterPdfPages", 7),
             None, 3, "text", ""),
        )

        for order, section in enumerate(source["sections"], 2):
            blocks = section.get("blocks", [])
            printed = [block.get("printedPage") for block in blocks if block.get("printedPage") is not None]
            db.execute(
                """INSERT INTO sections
                   (edition_id,sort_order,slug,title,json_page_start,json_page_end,
                    printed_page_start,printed_page_end,content_format,content)
                   VALUES(?,?,?,?,?,?,?,?,?,?)""",
                (roman_id, order, f"section-{section['sectionNo']:02d}", section["title"],
                 section["startPdfPage"], section["endPdfPage"],
                 min(printed) if printed else section.get("startPrintedPage"),
                 max(printed) if printed else section.get("endPrintedPage"),
                 "text", section_content(section)),
            )

        for order, (slug, title, relative_path, start, end) in enumerate(ENGLISH_SECTIONS, 1):
            manuscript_path = PROJECT / relative_path
            if not manuscript_path.is_file():
                continue
            content = manuscript_path.read_text(encoding="utf-8").strip()
            pages = [pages_by_no[n] for n in range(start, end + 1) if n in pages_by_no]
            printed = [pages_by_no[n].get("printedPage") for n in range(start, end + 1)
                       if n in pages_by_no and pages_by_no[n].get("printedPage") is not None]
            db.execute(
                """INSERT INTO sections
                   (edition_id,sort_order,slug,title,json_page_start,json_page_end,
                    printed_page_start,printed_page_end,content_format,content)
                   VALUES(?,?,?,?,?,?,?,?,?,?)""",
                (english_id, order, slug, english_title(content, title), start, end,
                 min(printed) if printed else None, max(printed) if printed else None,
                 "markdown", content),
            )

        db.commit()
        integrity = db.execute("PRAGMA integrity_check").fetchone()[0]
        foreign_keys = db.execute("PRAGMA foreign_key_check").fetchall()
        if integrity != "ok" or foreign_keys:
            raise RuntimeError(f"Database validation failed: integrity={integrity}, foreign_keys={foreign_keys}")

        print(f"Built {OUTPUT}")
        print("Editions and section counts:")
        for name, count in db.execute(
            "SELECT e.name,COUNT(s.section_id) FROM editions e LEFT JOIN sections s USING(edition_id) GROUP BY e.edition_id ORDER BY e.sort_order"
        ):
            print(f"  {name}: {count}")
        print(f"SQLite integrity: {integrity}")
        print(f"Foreign key issues: {len(foreign_keys)}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
