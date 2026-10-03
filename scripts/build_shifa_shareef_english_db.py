"""Build a searchable SQLite database from the Shifa Shareef English manuscript."""

import argparse
import re
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANUSCRIPT = ROOT / "publishing" / "shifa-shareef-english" / "manuscript"
OUTPUT = ROOT / "db" / "shifa-shareef.db"


def markdown_blocks(path: Path) -> list[tuple[str, str]]:
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n").strip()
    blocks = []
    for raw in re.split(r"\n\s*\n", text):
        value = raw.strip()
        if not value:
            continue
        block_type = "heading" if re.match(r"^#{1,6}\s", value) else "paragraph"
        blocks.append((block_type, value))
    return blocks


def section_title(path: Path) -> str:
    parent = path.parent.name.replace("-", " ").title()
    filename = path.stem.split("-", 1)[-1].replace("-", " ").title()
    return f"{parent}: {filename}"


def create_schema(db: sqlite3.Connection) -> None:
    db.executescript("""
        PRAGMA foreign_keys = ON;
        CREATE TABLE book (
            id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
            author TEXT, language TEXT, source_file TEXT, schema_version INTEGER,
            page_count INTEGER, front_matter_pdf_pages INTEGER, extracted_at TEXT
        );
        CREATE TABLE toc (
            id INTEGER PRIMARY KEY, book_id INTEGER NOT NULL REFERENCES book(id),
            section_no INTEGER NOT NULL, title TEXT NOT NULL, printed_page INTEGER,
            pdf_page INTEGER, UNIQUE(book_id, section_no)
        );
        CREATE TABLE section (
            id INTEGER PRIMARY KEY, book_id INTEGER NOT NULL REFERENCES book(id),
            section_no INTEGER NOT NULL, title TEXT NOT NULL, start_pdf_page INTEGER,
            end_pdf_page INTEGER, start_printed_page INTEGER, end_printed_page INTEGER,
            UNIQUE(book_id, section_no)
        );
        CREATE TABLE block (
            id INTEGER PRIMARY KEY, section_id INTEGER NOT NULL REFERENCES section(id),
            sequence_no INTEGER NOT NULL, block_type TEXT NOT NULL, pdf_page INTEGER,
            printed_page INTEGER, text TEXT NOT NULL, UNIQUE(section_id, sequence_no)
        );
        CREATE TABLE page (
            id INTEGER PRIMARY KEY, book_id INTEGER NOT NULL REFERENCES book(id),
            pdf_page INTEGER NOT NULL, printed_page INTEGER, kind TEXT NOT NULL,
            UNIQUE(book_id, pdf_page)
        );
        CREATE INDEX idx_block_section ON block(section_id);
        CREATE INDEX idx_block_section_seq ON block(section_id, sequence_no);
        CREATE INDEX idx_block_type ON block(block_type);
        CREATE INDEX idx_section_book ON section(book_id);
        CREATE INDEX idx_page_book_pdf ON page(book_id, pdf_page);
        CREATE INDEX idx_toc_section ON toc(book_id, section_no);
    """)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manuscript", type=Path, default=MANUSCRIPT)
    parser.add_argument("--output", type=Path, default=OUTPUT)
    args = parser.parse_args()

    manuscript = args.manuscript.resolve()
    files = sorted(manuscript.rglob("*.md"))
    files = [path for path in files if path.name.lower() not in {"readme.md", "migration_status.md"}]
    if not files:
        raise SystemExit(f"No manuscript Markdown files found under {manuscript}")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.output.exists():
        args.output.unlink()
    db = sqlite3.connect(args.output)
    try:
        create_schema(db)
        db.execute("""INSERT INTO book
            (slug, title, author, language, source_file, schema_version, page_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)""",
            ("shifa-shareef-english", "Shifa Shareef - English Translation",
             "Imam Qadi Iyad", "English", str(manuscript.relative_to(ROOT)), 1, len(files)))

        total_blocks = 0
        for section_no, path in enumerate(files, 1):
            title = section_title(path)
            section_id = db.execute(
                "INSERT INTO section (book_id, section_no, title) VALUES (1, ?, ?)",
                (section_no, title),
            ).lastrowid
            db.execute("INSERT INTO toc (book_id, section_no, title) VALUES (1, ?, ?)",
                       (section_no, title))
            for sequence_no, (block_type, text) in enumerate(markdown_blocks(path), 1):
                db.execute("""INSERT INTO block
                    (section_id, sequence_no, block_type, text) VALUES (?, ?, ?, ?)""",
                    (section_id, sequence_no, block_type, text))
                total_blocks += 1

        try:
            db.executescript("""
                CREATE VIRTUAL TABLE block_fts USING fts5(
                    text, content='block', content_rowid='id', tokenize='unicode61'
                );
                INSERT INTO block_fts(block_fts) VALUES('rebuild');
            """)
            fts = True
        except sqlite3.OperationalError:
            fts = False
        db.commit()
        integrity = db.execute("PRAGMA integrity_check").fetchone()[0]
        foreign_keys = db.execute("PRAGMA foreign_key_check").fetchall()
        print(f"Built {args.output} | sections={len(files)} | blocks={total_blocks} "
              f"| integrity={integrity} | fk_issues={len(foreign_keys)} | fts={fts}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
