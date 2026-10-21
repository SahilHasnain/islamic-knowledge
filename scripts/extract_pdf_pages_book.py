import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import fitz


def clean_line(text: str) -> str:
    return re.sub(r"[ \t]+", " ", text.replace("\u00a0", " ")).strip()


def extract_page(page: fitz.Page, pdf_page: int) -> tuple[str, int | None]:
    height = page.rect.height
    page_lines = []
    printed_page = None
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            text = clean_line("".join(span["text"] for span in line["spans"]))
            if not text:
                continue
            y0 = line["bbox"][1]
            if y0 >= height * 0.86 and text.isdigit():
                printed_page = int(text)
                continue
            page_lines.append((y0, text))

    page_lines.sort(key=lambda item: item[0])
    lines = [text for _, text in page_lines]
    if lines and lines[0].casefold() == "addawlatul makkiya":
        lines.pop(0)
    return "\n".join(lines).strip(), printed_page


def parse_toc(pages: list[dict]) -> list[dict]:
    entries = []
    for page in pages:
        if page["pdfPage"] > 7:
            continue
        pending_title = ""
        for line in page["text"].splitlines():
            match = re.fullmatch(r"\s*(.*?)\s*\.{3,}\s*(\d{1,3})\s*", line)
            if match:
                title = clean_line(match.group(1)).rstrip(" .") or pending_title
                if title:
                    entries.append(
                        {
                            "sectionNo": len(entries) + 1,
                            "title": title,
                            "printedPage": int(match.group(2)),
                            "pdfPage": page["pdfPage"],
                        }
                    )
                pending_title = ""
            elif line.strip():
                pending_title = clean_line(line)
    return entries


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def clean_body_page(text: str) -> str:
    lines = text.splitlines()
    lines = [line for line in lines if clean_line(line).casefold() != "addawlatul makkiya"]
    for index, line in enumerate(lines):
        if line.strip():
            if re.fullmatch(r"\s*\d{1,3}\s*", line):
                lines.pop(index)
            break
    return "\n".join(lines).strip()


def normalized_with_offsets(text: str) -> tuple[str, list[int]]:
    chars = []
    offsets = []
    for index, char in enumerate(text):
        if char.isascii() and char.isalnum():
            chars.append(char.lower())
            offsets.append(index)
    return "".join(chars), offsets


def locate_toc_headings(pages: list[dict], toc: list[dict]) -> list[tuple[int, int, int]]:
    located = []
    last_page = 0
    for entry in toc:
        needle = "".join(char.lower() for char in entry["title"] if char.isascii() and char.isalnum())
        if not needle:
            continue
        target = entry["printedPage"]
        candidates = [
            page
            for page in pages
            if page["printedPage"] is not None
            and max(4, target - 1) <= page["printedPage"] <= target + 2
            and page["pdfPage"] >= last_page
        ]
        match = None
        for page in candidates:
            text = page["bodyText"]
            normalized, offsets = normalized_with_offsets(text)
            position = normalized.find(needle)
            if position >= 0:
                match = (page["pdfPage"], offsets[position])
                break
        if match is None:
            raise ValueError(f"Could not locate TOC heading in body: {entry['title']} (printed page {target})")
        pdf_page, char_offset = match
        located.append((pdf_page, char_offset, entry["sectionNo"]))
        last_page = pdf_page
    return located


def build_logical_sections(pages: list[dict], toc: list[dict]) -> list[dict]:
    located = locate_toc_headings(pages, toc)
    starts_by_page = {}
    for pdf_page, offset, section_no in located:
        starts_by_page.setdefault(pdf_page, []).append((offset, section_no))

    sections_by_no = {
        entry["sectionNo"]: {
            "sectionNo": entry["sectionNo"],
            "title": entry["title"],
            "startPdfPage": None,
            "endPdfPage": None,
            "startPrintedPage": entry["printedPage"],
            "endPrintedPage": None,
            "blocks": [],
        }
        for entry in toc
    }
    current_section = None

    for page in pages:
        pdf_page = page["pdfPage"]
        body_text = page["bodyText"]
        if pdf_page < 8 or not body_text or page["printedPage"] is None:
            continue
        page_starts = sorted(starts_by_page.get(pdf_page, []))
        boundaries = [(0, current_section)]
        boundaries.extend(page_starts)
        boundaries.append((len(body_text), None))
        for index in range(len(boundaries) - 1):
            start_offset, section_no = boundaries[index]
            end_offset = boundaries[index + 1][0]
            if section_no is not None:
                current_section = section_no
            text = body_text[start_offset:end_offset].strip()
            if not text or current_section is None:
                continue
            section = sections_by_no[current_section]
            if section["startPdfPage"] is None:
                section["startPdfPage"] = pdf_page
            section["endPdfPage"] = pdf_page
            section["endPrintedPage"] = page["printedPage"]
            section["blocks"].append(
                {
                    "sequenceNo": len(section["blocks"]) + 1,
                    "blockType": "content",
                    "pdfPage": pdf_page,
                    "printedPage": page["printedPage"],
                    "text": text,
                }
            )

    return [sections_by_no[entry["sectionNo"]] for entry in toc]


def write_book(path: Path, book: dict) -> None:
    compact_arrays = {"toc", "sections", "pageMap"}
    lines = ["{"]
    items = list(book.items())
    for item_index, (key, value) in enumerate(items):
        comma = "," if item_index < len(items) - 1 else ""
        key_text = json.dumps(key, ensure_ascii=False)
        if key in compact_arrays:
            lines.append(f"  {key_text}: [")
            for index, entry in enumerate(value):
                entry_comma = "," if index < len(value) - 1 else ""
                lines.append("    " + json.dumps(entry, ensure_ascii=False) + entry_comma)
            lines.append("  ]" + comma)
        else:
            lines.append(
                f"  {key_text}: {json.dumps(value, ensure_ascii=False)}{comma}"
            )
    lines.append("}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract a prose PDF book into page-traceable normalized JSON.")
    parser.add_argument("--pdf", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--author", required=True)
    parser.add_argument("--language", default="Roman Urdu")
    parser.add_argument(
        "--reference-json",
        type=Path,
        help="Reuse text from an earlier extraction only if its source PDF is byte-identical.",
    )
    args = parser.parse_args()

    document = fitz.open(args.pdf)
    pages = []
    printed_map = {}
    for pdf_page, page in enumerate(document, start=1):
        text, printed_page = extract_page(page, pdf_page)
        if printed_page is not None:
            printed_map[pdf_page] = printed_page
        pages.append({"pdfPage": pdf_page, "printedPage": printed_page, "text": text})

    if args.reference_json:
        reference = json.loads(args.reference_json.read_text(encoding="utf-8"))
        if reference.get("pageCount") != document.page_count:
            parser.error("Reference extraction page count does not match the PDF.")
        reference_pdf = args.pdf.parent / reference["sourceFile"]
        if not reference_pdf.is_file() or file_sha256(reference_pdf) != file_sha256(args.pdf):
            parser.error("Reference extraction source PDF is not byte-identical to the requested PDF.")
        if reference.get("pages"):
            reference_pages = {
                entry["pageNumber"]: entry for entry in reference["pages"]
            }
        else:
            reference_pages = {
                section["startPdfPage"]: {
                    "text": "\n".join(block["text"] for block in section["blocks"]),
                    "printedPage": section.get("startPrintedPage"),
                }
                for section in reference.get("sections", [])
            }
        if len(reference_pages) != document.page_count:
            parser.error("Reference extraction does not contain exactly one record per PDF page.")
        page_map_reference = {
            page["pdfPage"]: page
            for page in reference.get("pageMap", [])
        }
        for page in pages:
            old_page = reference_pages[page["pdfPage"]]
            page["text"] = old_page["text"]
            page["printedPage"] = old_page.get("printedPage")
            if page["printedPage"] is None:
                page["printedPage"] = page_map_reference.get(page["pdfPage"], {}).get("printedPage")
            if page["printedPage"] is not None:
                printed_map[page["pdfPage"]] = page["printedPage"]

    for page in pages:
        page["bodyText"] = clean_body_page(page["text"])

    last_book_page = max(printed_map, default=7)
    toc = parse_toc(pages)
    sections = build_logical_sections(pages, toc)

    page_map = []
    for page in pages:
        pdf_page = page["pdfPage"]
        if pdf_page <= 4:
            kind = "frontmatter"
        elif pdf_page <= 7:
            kind = "contents"
        elif page["printedPage"] is None or pdf_page > last_book_page + 4:
            kind = "backmatter"
        else:
            kind = "body"
        page_map.append({"pdfPage": pdf_page, "printedPage": page["printedPage"], "kind": kind})

    book = {
        "schemaVersion": 2,
        "slug": args.slug,
        "title": args.title,
        "author": args.author,
        "language": args.language,
        "sourceFile": args.pdf.name,
        "extractedWith": "layout-aware PyMuPDF page extractor",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "pageCount": document.page_count,
        "frontMatterPdfPages": 7,
        "toc": toc,
        "sections": sections,
        "pageMap": page_map,
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    write_book(args.output, book)
    block_count = sum(len(section["blocks"]) for section in sections)
    print(
        f"Extracted {document.page_count} pages, {len(sections)} logical sections, "
        f"{block_count} blocks, {len(book['toc'])} TOC entries to {args.output}"
    )


if __name__ == "__main__":
    main()
