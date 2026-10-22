"""Migrate page-based book JSON files to the logical book schema v2."""

import json
from datetime import datetime, timezone
from pathlib import Path


BOOKS = Path(__file__).resolve().parents[1] / "content" / "books"
LEGACY_BOOKS = (
    "al-amnu-wal-ula.json",
    "shifa-shareef.json",
    "kanzul-iman-english.json",
    "kanzul-iman-roman.json",
)
RECORD_ARRAYS = {"frontMatter", "toc", "sections", "pageMap"}


def write_book(path: Path, book: dict) -> None:
    """Write two compact JSON records per line to keep large files manageable."""
    lines = ["{"]
    items = list(book.items())
    for index, (key, value) in enumerate(items):
        comma = "," if index + 1 < len(items) else ""
        quoted_key = json.dumps(key, ensure_ascii=False)
        if key in RECORD_ARRAYS and isinstance(value, list):
            lines.append(f"  {quoted_key}: [")
            for start in range(0, len(value), 2):
                group = value[start : start + 2]
                encoded = ", ".join(
                    json.dumps(record, ensure_ascii=False, separators=(",", ":"))
                    for record in group
                )
                suffix = "," if start + len(group) < len(value) else ""
                lines.append("    " + encoded + suffix)
            lines.append("  ]" + comma)
        else:
            encoded = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
            lines.append(f"  {quoted_key}: {encoded}{comma}")
    lines.append("}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def migrate(path: Path) -> dict:
    old = json.loads(path.read_text(encoding="utf-8"))
    printed_by_page = {}
    sections = []

    for section_no, old_section in enumerate(old.get("sections", []), start=1):
        blocks = []
        for old_page in old_section.get("pages", []):
            pdf_page = old_page["pageNumber"]
            printed_page = old_page.get("printedPageNumber")
            if printed_page is not None:
                printed_by_page.setdefault(pdf_page, printed_page)
            text = old_page.get("text", "")
            if text:
                blocks.append(
                    {
                        "sequenceNo": len(blocks) + 1,
                        "blockType": "content",
                        "pdfPage": pdf_page,
                        "printedPage": printed_page,
                        "text": text,
                    }
                )
        if not blocks:
            raise ValueError(f"{path.name}: empty logical section {old_section['title']!r}")
        sections.append(
            {
                "sectionNo": section_no,
                "slug": old_section.get("slug"),
                "title": old_section["title"],
                "startPdfPage": blocks[0]["pdfPage"],
                "endPdfPage": blocks[-1]["pdfPage"],
                "startPrintedPage": old_section.get(
                    "printedPageNumber", blocks[0]["printedPage"]
                ),
                "endPrintedPage": blocks[-1]["printedPage"],
                "blocks": blocks,
            }
        )

    toc = []
    for section_no, entry in enumerate(old.get("tableOfContents", []), start=1):
        pdf_page = entry.get("pdfPageNumber")
        printed_page = entry.get("printedPageNumber")
        toc.append(
            {
                "sectionNo": section_no,
                "title": entry["title"],
                "printedPage": printed_page,
                "pdfPage": pdf_page,
            }
        )
        if pdf_page is not None and printed_page is not None:
            printed_by_page.setdefault(pdf_page, printed_page)

    old_pages = old.get("pages", [])
    first_content_page = min(
        (section["startPdfPage"] for section in sections),
        default=2 if old["pageCount"] > 1 else 1,
    )

    # Page-only works have no source TOC. Keep every original page as a block in
    # one explicitly untitled-content section rather than fabricating headings.
    if not sections:
        blocks = []
        for old_page in old_pages:
            text = old_page.get("text", "")
            if not text:
                continue
            blocks.append(
                {
                    "sequenceNo": len(blocks) + 1,
                    "blockType": "content",
                    "pdfPage": old_page["pageNumber"],
                    "printedPage": None,
                    "text": text,
                }
            )
        if not blocks:
            raise ValueError(f"{path.name}: no page text to migrate")
        sections = [
            {
                "sectionNo": 1,
                "slug": "full-text",
                "title": "Full Text",
                "startPdfPage": blocks[0]["pdfPage"],
                "endPdfPage": blocks[-1]["pdfPage"],
                "startPrintedPage": None,
                "endPrintedPage": None,
                "blocks": blocks,
            }
        ]
        first_content_page = blocks[0]["pdfPage"]

    old_pages_by_number = {page["pageNumber"]: page for page in old_pages}
    front_matter = [
        {
            "pdfPage": number,
            "printedPage": printed_by_page.get(number),
            "text": old_pages_by_number.get(number, {}).get("text", ""),
        }
        for number in range(1, first_content_page)
    ]
    block_pages = {
        block["pdfPage"] for section in sections for block in section["blocks"]
    }
    page_map = []
    for number in range(1, old["pageCount"] + 1):
        if number < first_content_page:
            kind = "frontmatter"
        elif number in block_pages:
            kind = "body"
        else:
            kind = "backmatter"
        page_map.append(
            {
                "pdfPage": number,
                "printedPage": printed_by_page.get(number),
                "kind": kind,
            }
        )

    extracted_with = old.get("extractedWith", "unknown")
    result = {
        "schemaVersion": 2,
        "slug": old["slug"],
        "title": old["title"],
        "author": old.get("author"),
        "language": old.get("language"),
        "sourceFile": old.get("sourceFile"),
        "extractedWith": extracted_with + "; migrated to logical book schema v2",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "pageCount": old["pageCount"],
        "frontMatterPdfPages": first_content_page - 1,
        "frontMatter": front_matter,
        "toc": toc,
        "sections": sections,
        "pageMap": page_map,
    }
    write_book(path, result)
    return result


def main() -> None:
    for filename in LEGACY_BOOKS:
        book = migrate(BOOKS / filename)
        print(
            f"{filename}: schema v2; {book['pageCount']} pages; "
            f"{len(book['sections'])} sections; {len(book['toc'])} TOC records"
        )


if __name__ == "__main__":
    main()
