import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import fitz


def printed_page(text: str) -> int | None:
    match = re.search(r"(?m)^Ikhteyarate Mustafa\s+ﷺ\s+(\d+)\s*$", text)
    return int(match.group(1)) if match else None


def compact_json(path: Path, data: dict) -> None:
    one_per_record = {"toc", "sections", "pageMap", "frontMatter"}
    lines = ["{"]
    pairs = list(data.items())
    for index, (key, value) in enumerate(pairs):
        comma = "," if index < len(pairs) - 1 else ""
        key_text = json.dumps(key, ensure_ascii=False)
        if key in one_per_record:
            lines.append(f"  {key_text}: [")
            for record_index, record in enumerate(value):
                record_comma = "," if record_index < len(value) - 1 else ""
                lines.append("    " + json.dumps(record, ensure_ascii=False) + record_comma)
            lines.append("  ]" + comma)
        else:
            lines.append(f"  {key_text}: {json.dumps(value, ensure_ascii=False)}{comma}")
    lines.append("}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Normalize a legacy page-based book JSON while retaining its complete named sections."
    )
    parser.add_argument("--legacy-json", required=True, type=Path)
    parser.add_argument("--pdf", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    legacy_text = (
        sys.stdin.buffer.read().decode("utf-8")
        if str(args.legacy_json) == "-"
        else args.legacy_json.read_text(encoding="utf-8")
    )
    legacy = json.loads(legacy_text)
    document = fitz.open(args.pdf)
    if document.page_count != legacy.get("pageCount"):
        parser.error("PDF page count does not match the existing extraction.")
    if args.pdf.name != legacy.get("sourceFile"):
        parser.error("PDF filename does not match the existing extraction sourceFile.")
    if len(legacy.get("pages", [])) != document.page_count:
        parser.error("Existing extraction does not contain one page record per PDF page.")

    page_records = {page["pageNumber"]: page for page in legacy["pages"]}
    printed_by_page = {
        page_number: printed_page(page_record["text"])
        for page_number, page_record in page_records.items()
    }

    toc = []
    for section_no, entry in enumerate(legacy.get("tableOfContents", []), start=1):
        toc.append(
            {
                "sectionNo": section_no,
                "title": entry["title"],
                "printedPage": entry.get("printedPageNumber"),
                "pdfPage": entry.get("pdfPageNumber"),
            }
        )

    sections = []
    covered_pages = set()
    for section_no, source_section in enumerate(legacy.get("sections", []), start=1):
        blocks = []
        for page in sorted(source_section.get("pages", []), key=lambda item: item["pageNumber"]):
            pdf_page = page["pageNumber"]
            covered_pages.add(pdf_page)
            text = page.get("text", "").strip()
            if not text:
                continue
            page_no = printed_by_page.get(pdf_page)
            blocks.append(
                {
                    "sequenceNo": len(blocks) + 1,
                    "blockType": "content",
                    "pdfPage": pdf_page,
                    "printedPage": page_no,
                    "text": text,
                }
            )
        if not blocks:
            parser.error(f"Logical section has no text: {source_section['title']}")
        sections.append(
            {
                "sectionNo": section_no,
                "slug": source_section.get("slug"),
                "title": source_section["title"],
                "startPdfPage": blocks[0]["pdfPage"],
                "endPdfPage": blocks[-1]["pdfPage"],
                "startPrintedPage": source_section.get("printedPageNumber"),
                "endPrintedPage": blocks[-1]["printedPage"],
                "blocks": blocks,
            }
        )

    if len(toc) != len(sections):
        parser.error("TOC and logical-section counts do not match.")
    for page in range(7, 66):
        if page not in covered_pages:
            parser.error(f"Logical sections omit non-front-matter PDF page {page}.")

    page_map = []
    for page_number in range(1, document.page_count + 1):
        if page_number <= 5:
            kind = "frontmatter"
        elif page_number == 6:
            kind = "contents"
        elif printed_by_page.get(page_number) is not None:
            kind = "body"
        else:
            kind = "backmatter"
        page_map.append(
            {
                "pdfPage": page_number,
                "printedPage": printed_by_page.get(page_number),
                "kind": kind,
            }
        )

    front_matter = []
    for page_number in range(1, 7):
        text = document[page_number - 1].get_text("text", sort=True).strip()
        front_matter.append(
            {
                "pdfPage": page_number,
                "printedPage": printed_by_page.get(page_number),
                "text": text,
            }
        )

    result = {
        "schemaVersion": 2,
        "slug": legacy["slug"],
        "title": legacy["title"],
        "author": legacy.get("author"),
        "language": legacy.get("language"),
        "sourceFile": args.pdf.name,
        "extractedWith": "PyMuPDF; normalized from complete source-page extraction",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "pageCount": document.page_count,
        "frontMatterPdfPages": 6,
        "frontMatter": front_matter,
        "toc": toc,
        "sections": sections,
        "pageMap": page_map,
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    compact_json(args.output, result)
    print(
        f"Normalized {document.page_count} pages into {len(sections)} complete logical sections, "
        f"{sum(len(section['blocks']) for section in sections)} page-content blocks, "
        f"and {len(toc)} TOC entries at {args.output}"
    )


if __name__ == "__main__":
    main()
