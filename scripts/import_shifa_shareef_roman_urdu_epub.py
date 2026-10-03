"""Import a Shifa Shareef EPUB as a separate edition in the shared book DB."""

import argparse
import mimetypes
import sqlite3
import zipfile
from pathlib import Path
from xml.etree import ElementTree

from bs4 import BeautifulSoup, Tag


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "db" / "shifa-shareef.db"
DEFAULT_EPUB = Path.home() / "Downloads" / "Shifa Shareef Roman HQ.epub"
OPF_NS = {"opf": "http://www.idpf.org/2007/opf", "dc": "http://purl.org/dc/elements/1.1/"}
BLOCK_TAGS = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "table", "blockquote", "pre", "div"}


def epub_spine(epub: zipfile.ZipFile) -> tuple[dict, list[str], dict[str, str]]:
    container = ElementTree.fromstring(epub.read("META-INF/container.xml"))
    rootfile = container.find(".//{*}rootfile")
    if rootfile is None:
        raise ValueError("EPUB container has no package document")
    opf_path = rootfile.attrib["full-path"]
    opf = ElementTree.fromstring(epub.read(opf_path))
    base = Path(opf_path).parent
    manifest = {item.attrib["id"]: str(base / item.attrib["href"]).replace("\\", "/")
                for item in opf.findall(".//opf:manifest/opf:item", OPF_NS)}
    mime_types = {str(base / item.attrib["href"]).replace("\\", "/"): item.attrib.get("media-type", "")
                  for item in opf.findall(".//opf:manifest/opf:item", OPF_NS)}
    spine = [manifest[item.attrib["idref"]]
             for item in opf.findall(".//opf:spine/opf:itemref", OPF_NS)
             if item.attrib.get("idref") in manifest]
    title_node = opf.find(".//dc:title", OPF_NS)
    creator_node = opf.find(".//dc:creator", OPF_NS)
    metadata = {
        "title": title_node.text.strip() if title_node is not None and title_node.text else "Shifa Shareef (Roman Urdu)",
        "author": creator_node.text.strip() if creator_node is not None and creator_node.text else "Imam Qadi Iyad",
    }
    return metadata, spine, mime_types


def content_blocks(document: bytes) -> list[tuple[str, str]]:
    soup = BeautifulSoup(document, "html.parser")
    body = soup.body or soup
    result: list[tuple[str, str]] = []

    def add_tag(tag: Tag) -> None:
        if tag.name in {"ul", "ol"}:
            for child in tag.find_all("li", recursive=False):
                result.append(("list_item", str(child)))
            return
        if tag.name == "div" and tag.find(list(BLOCK_TAGS), recursive=False):
            for child in tag.children:
                if isinstance(child, Tag):
                    visit(child)
            return
        if tag.name in BLOCK_TAGS and tag.get_text("", strip=True):
            kind = "heading" if tag.name in {"h1", "h2", "h3", "h4", "h5", "h6"} else tag.name
            result.append((kind, str(tag)))
        elif tag.name not in BLOCK_TAGS:
            for child in tag.children:
                if isinstance(child, Tag):
                    visit(child)

    def visit(tag: Tag) -> None:
        if tag.name in {"ul", "ol"} or tag.name in BLOCK_TAGS:
            add_tag(tag)
        else:
            for child in tag.children:
                if isinstance(child, Tag):
                    visit(child)

    for child in body.children:
        if isinstance(child, Tag):
            visit(child)
    return result


def normalized_text(value: str) -> str:
    return " ".join(value.split())


def is_cover_asset(path: str, media_type: str | None) -> bool:
    name = Path(path).name.lower()
    return ("cover" in name or "cove" in name) and (
        bool(media_type and media_type.startswith("image/"))
        or media_type == "application/xhtml+xml"
    )


def verify_document_coverage(document: bytes, blocks: list[tuple[str, str]], path: str) -> None:
    soup = BeautifulSoup(document, "html.parser")
    body = soup.body or soup
    source_text = normalized_text(body.get_text(" ", strip=True))
    extracted_text = normalized_text(" ".join(
        BeautifulSoup(html, "html.parser").get_text(" ", strip=True)
        for _, html in blocks
    ))
    if source_text != extracted_text:
        raise ValueError(f"Extracted text does not exactly cover EPUB document {path}")


def display_section_title(path: str, document: bytes) -> str:
    soup = BeautifulSoup(document, "html.parser")
    heading = soup.body.find(["h1", "h2", "h3"]) if soup.body else None
    if heading and heading.get_text(" ", strip=True):
        return heading.get_text(" ", strip=True)
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    if title and title.lower() != "unknown":
        return title
    return Path(path).stem.replace("_", " ").replace("-", " ").title()


def import_epub(epub_path: Path, db_path: Path, slug: str, language: str,
                omit_fonts: bool = False, omit_cover: bool = False) -> None:
    if not epub_path.is_file():
        raise SystemExit(f"EPUB not found: {epub_path}")
    db = sqlite3.connect(db_path)
    db.execute("PRAGMA foreign_keys = ON")
    try:
        db.execute("ALTER TABLE block ADD COLUMN content_format TEXT NOT NULL DEFAULT 'markdown'")
    except sqlite3.OperationalError as exc:
        if "duplicate column" not in str(exc).lower():
            raise
    db.execute("""CREATE TABLE IF NOT EXISTS edition_asset (
        id INTEGER PRIMARY KEY,
        book_id INTEGER NOT NULL REFERENCES book(id),
        path TEXT NOT NULL,
        media_type TEXT,
        content BLOB NOT NULL,
        UNIQUE(book_id, path)
    )""")

    with zipfile.ZipFile(epub_path) as epub:
        metadata, spine, mime_types = epub_spine(epub)
        prior = db.execute("SELECT id FROM book WHERE slug = ?", (slug,)).fetchone()
        if prior:
            book_id = prior[0]
            db.execute("DELETE FROM block WHERE section_id IN (SELECT id FROM section WHERE book_id=?)", (book_id,))
            db.execute("DELETE FROM section WHERE book_id=?", (book_id,))
            db.execute("DELETE FROM toc WHERE book_id=?", (book_id,))
            db.execute("DELETE FROM page WHERE book_id=?", (book_id,))
            db.execute("DELETE FROM edition_asset WHERE book_id=?", (book_id,))
            db.execute("DELETE FROM book WHERE id=?", (book_id,))
        cursor = db.execute("""INSERT INTO book
            (slug, title, author, language, source_file, schema_version, page_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (slug, metadata["title"], metadata["author"], language, str(epub_path), 1, len(spine)))
        book_id = cursor.lastrowid
        total_blocks = 0
        for section_no, path in enumerate(spine, 1):
            data = epub.read(path)
            title = display_section_title(path, data)
            blocks = content_blocks(data)
            verify_document_coverage(data, blocks, path)
            section_id = db.execute(
                "INSERT INTO section (book_id, section_no, title) VALUES (?, ?, ?)",
                (book_id, section_no, title),
            ).lastrowid
            db.execute("INSERT INTO toc (book_id, section_no, title) VALUES (?, ?, ?)",
                       (book_id, section_no, title))
            for sequence_no, (block_type, html) in enumerate(blocks, 1):
                db.execute("""INSERT INTO block
                    (section_id, sequence_no, block_type, text, content_format)
                    VALUES (?, ?, ?, ?, 'html')""",
                    (section_id, sequence_no, block_type, html))
                total_blocks += 1

        # Keep the source package resources so the EPUB's CSS, fonts, images, and
        # original XHTML can be recovered and rendered with the extracted blocks.
        for name in epub.namelist():
            data = epub.read(name)
            media_type = mime_types.get(name) or mimetypes.guess_type(name)[0]
            if omit_fonts and media_type and "font" in media_type.lower():
                continue
            if omit_cover and is_cover_asset(name, media_type):
                continue
            if name == "mimetype":
                media_type = "application/epub+zip"
            db.execute("INSERT INTO edition_asset (book_id, path, media_type, content) VALUES (?, ?, ?, ?)",
                       (book_id, name, media_type, data))

    try:
        db.execute("INSERT INTO block_fts(block_fts) VALUES('rebuild')")
    except sqlite3.OperationalError:
        pass
    db.commit()
    integrity = db.execute("PRAGMA integrity_check").fetchone()[0]
    fk_issues = len(db.execute("PRAGMA foreign_key_check").fetchall())
    edition = db.execute("SELECT id FROM book WHERE slug=?", (slug,)).fetchone()[0]
    section_count = db.execute("SELECT count(*) FROM section WHERE book_id=?", (edition,)).fetchone()[0]
    asset_count = db.execute("SELECT count(*) FROM edition_asset WHERE book_id=?", (edition,)).fetchone()[0]
    print(f"Imported {epub_path.name} | sections={section_count} | blocks={total_blocks} "
          f"| preserved_assets={asset_count} | integrity={integrity} | fk_issues={fk_issues}")
    db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--epub", type=Path, default=DEFAULT_EPUB)
    parser.add_argument("--database", type=Path, default=DB_PATH)
    parser.add_argument("--edition-slug", default="shifa-shareef-roman-urdu")
    parser.add_argument("--language", default="Roman Urdu")
    parser.add_argument("--omit-fonts", action="store_true",
                        help="Do not store embedded font resources in the database")
    parser.add_argument("--omit-cover", action="store_true",
                        help="Do not store cover image or cover-page resources")
    args = parser.parse_args()
    import_epub(args.epub, args.database, args.edition_slug, args.language,
                args.omit_fonts, args.omit_cover)


if __name__ == "__main__":
    main()
