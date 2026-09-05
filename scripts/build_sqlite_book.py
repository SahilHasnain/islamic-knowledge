import argparse
import json
import sqlite3
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Build a SQLite database from a normalized book JSON")
    parser.add_argument("json_file", help="Path to the normalized book JSON in content/books/")
    parser.add_argument(
        "--output",
        default=None,
        help="Output .db path (default: db/<slug>.db)",
    )
    args = parser.parse_args()

    book = json.loads(Path(args.json_file).read_text(encoding="utf-8"))
    slug = book["slug"]
    output = Path(args.output) if args.output else Path("db") / f"{slug}.db"
    output.parent.mkdir(parents=True, exist_ok=True)

    if output.exists():
        output.unlink()

    connection = sqlite3.connect(output)
    try:
        connection.execute("PRAGMA foreign_keys = ON")
        create_tables(connection)
        insert_book(connection, book)
        insert_toc(connection, book)
        insert_sections(connection, book)
        insert_pages(connection, book)

        uses_fts = create_fts(connection)
        connection.commit()

        integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
        fk_check = connection.execute("PRAGMA foreign_key_check").fetchall()
        print(
            f"Built {output} | book={slug} | integrity={integrity} "
            f"| fk_issues={len(fk_check)} | fts={uses_fts}"
        )
    finally:
        connection.close()


def create_tables(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        CREATE TABLE book (
            id INTEGER PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            author TEXT,
            language TEXT,
            source_file TEXT,
            schema_version INTEGER,
            page_count INTEGER,
            front_matter_pdf_pages INTEGER,
            extracted_at TEXT
        );

        CREATE TABLE toc (
            id INTEGER PRIMARY KEY,
            book_id INTEGER NOT NULL REFERENCES book(id),
            section_no INTEGER NOT NULL,
            title TEXT NOT NULL,
            printed_page INTEGER,
            pdf_page INTEGER,
            UNIQUE (book_id, section_no)
        );

        CREATE TABLE section (
            id INTEGER PRIMARY KEY,
            book_id INTEGER NOT NULL REFERENCES book(id),
            section_no INTEGER NOT NULL,
            title TEXT NOT NULL,
            start_pdf_page INTEGER,
            end_pdf_page INTEGER,
            start_printed_page INTEGER,
            end_printed_page INTEGER,
            UNIQUE (book_id, section_no)
        );

        CREATE TABLE block (
            id INTEGER PRIMARY KEY,
            section_id INTEGER NOT NULL REFERENCES section(id),
            sequence_no INTEGER NOT NULL,
            block_type TEXT NOT NULL,
            pdf_page INTEGER,
            printed_page INTEGER,
            text TEXT NOT NULL,
            UNIQUE (section_id, sequence_no)
        );

        CREATE TABLE page (
            id INTEGER PRIMARY KEY,
            book_id INTEGER NOT NULL REFERENCES book(id),
            pdf_page INTEGER NOT NULL,
            printed_page INTEGER,
            kind TEXT NOT NULL,
            UNIQUE (book_id, pdf_page)
        );

        CREATE INDEX idx_block_section ON block(section_id);
        CREATE INDEX idx_block_section_seq ON block(section_id, sequence_no);
        CREATE INDEX idx_block_type ON block(block_type);
        CREATE INDEX idx_section_book ON section(book_id);
        CREATE INDEX idx_page_book_pdf ON page(book_id, pdf_page);
        CREATE INDEX idx_toc_section ON toc(book_id, section_no);
        """
    )


def insert_book(connection: sqlite3.Connection, book: dict) -> None:
    connection.execute(
        """
        INSERT INTO book
            (slug, title, author, language, source_file, schema_version,
             page_count, front_matter_pdf_pages, extracted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            book["slug"],
            book["title"],
            book.get("author"),
            book.get("language"),
            book.get("sourceFile"),
            book.get("schemaVersion"),
            book.get("pageCount"),
            book.get("frontMatterPdfPages"),
            book.get("extractedAt"),
        ),
    )


def insert_toc(connection: sqlite3.Connection, book: dict) -> None:
    for entry in book.get("toc", []):
        connection.execute(
            """
            INSERT INTO toc (book_id, section_no, title, printed_page, pdf_page)
            VALUES (1, ?, ?, ?, ?)
            """,
            (entry["sectionNo"], entry["title"], entry.get("printedPage"), entry.get("pdfPage")),
        )


def insert_sections(connection: sqlite3.Connection, book: dict) -> None:
    for section in book.get("sections", []):
        section_id = connection.execute(
            """
            INSERT INTO section
                (book_id, section_no, title, start_pdf_page, end_pdf_page,
                 start_printed_page, end_printed_page)
            VALUES (1, ?, ?, ?, ?, ?, ?)
            """,
            (
                section["sectionNo"],
                section["title"],
                section.get("startPdfPage"),
                section.get("endPdfPage"),
                section.get("startPrintedPage"),
                section.get("endPrintedPage"),
            ),
        ).lastrowid

        for block in section.get("blocks", []):
            connection.execute(
                """
                INSERT INTO block
                    (section_id, sequence_no, block_type, pdf_page, printed_page, text)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    section_id,
                    block["sequenceNo"],
                    block["blockType"],
                    block.get("pdfPage"),
                    block.get("printedPage"),
                    block["text"],
                ),
            )


def insert_pages(connection: sqlite3.Connection, book: dict) -> None:
    for page in book.get("pageMap", []):
        connection.execute(
            """
            INSERT INTO page (book_id, pdf_page, printed_page, kind)
            VALUES (1, ?, ?, ?)
            """,
            (page["pdfPage"], page.get("printedPage"), page["kind"]),
        )


def create_fts(connection: sqlite3.Connection) -> bool:
    try:
        connection.executescript(
            """
            CREATE VIRTUAL TABLE block_fts USING fts5(
                text,
                content='block',
                content_rowid='id',
                tokenize='unicode61'
            );

            INSERT INTO block_fts(block_fts) VALUES('rebuild');
            """
        )
        return True
    except sqlite3.OperationalError:
        return False


if __name__ == "__main__":
    main()