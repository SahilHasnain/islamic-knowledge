import argparse
import json
import re
from pathlib import Path


BOOK_PAGE_OFFSET = 4
TOC_PDF_PAGES = {5, 6, 7}
BOOK_HEADER = "Addawlatul Makkiya"


def slugify(value: str) -> str:
    value = value.casefold()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "section"


def clean_page_text(text: str) -> str:
    lines = [line.strip() for line in text.splitlines()]

    while lines and not lines[0]:
      lines.pop(0)

    if lines and lines[0].casefold() == BOOK_HEADER.casefold():
        lines.pop(0)

    while lines and not lines[0]:
        lines.pop(0)

    if lines and re.fullmatch(r"\d+", lines[0]):
        lines.pop(0)

    return "\n".join(lines).strip()


def text_to_paragraphs(text: str) -> list[str]:
    paragraphs = []
    buffer = []

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            if buffer:
                paragraphs.append(" ".join(buffer).strip())
                buffer = []
            continue

        if line.startswith("•"):
            if buffer:
                paragraphs.append(" ".join(buffer).strip())
                buffer = []
            paragraphs.append(line)
            continue

        buffer.append(line)

    if buffer:
        paragraphs.append(" ".join(buffer).strip())

    return [paragraph for paragraph in paragraphs if paragraph]


def parse_table_of_contents(pages: list[dict]) -> list[dict]:
    entries = []

    for page in pages:
        if page["pageNumber"] not in TOC_PDF_PAGES:
            continue

        for line in page["text"].splitlines():
            stripped = line.strip()
            match = re.match(r"^(?P<title>.+?)\s*\.{3,}\s*(?P<page>\d+)\s*$", stripped)
            if not match:
                continue

            title = re.sub(r"\s+", " ", match.group("title")).strip(" .")
            if not title or title.casefold() in {"contents", BOOK_HEADER.casefold()}:
                continue

            printed_page = int(match.group("page"))
            entries.append(
                {
                    "title": title.title(),
                    "printedPageNumber": printed_page,
                    "pdfPageNumber": printed_page + BOOK_PAGE_OFFSET,
                }
            )

    deduped = []
    seen = set()
    for entry in entries:
        key = (entry["title"].casefold(), entry["printedPageNumber"])
        if key in seen:
            continue
        deduped.append(entry)
        seen.add(key)

    return deduped


def format_sections(book: dict, toc: list[dict]) -> list[dict]:
    pages_by_number = {page["pageNumber"]: page for page in book["pages"]}
    sections = []
    slug_counts = {}

    for index, entry in enumerate(toc):
        next_entry = toc[index + 1] if index + 1 < len(toc) else None
        start_page = entry["pdfPageNumber"]
        end_page = (next_entry["pdfPageNumber"] - 1) if next_entry else book["pageCount"]
        end_page = max(start_page, min(end_page, book["pageCount"]))

        section_pages = []
        section_paragraphs = []

        for page_number in range(start_page, end_page + 1):
            source_page = pages_by_number.get(page_number)
            if not source_page:
                continue

            cleaned_text = clean_page_text(source_page["text"])
            paragraphs = text_to_paragraphs(cleaned_text)
            section_pages.append(
                {
                    "pageNumber": page_number,
                    "printedPageNumber": page_number - BOOK_PAGE_OFFSET,
                    "text": cleaned_text,
                    "paragraphs": paragraphs,
                }
            )
            section_paragraphs.extend(paragraphs)

        base_slug = slugify(entry["title"])
        slug_counts[base_slug] = slug_counts.get(base_slug, 0) + 1
        slug = base_slug if slug_counts[base_slug] == 1 else f"{base_slug}-{slug_counts[base_slug]}"

        sections.append(
            {
                "slug": slug,
                "title": entry["title"],
                "startPageNumber": start_page,
                "endPageNumber": end_page,
                "printedPageNumber": entry["printedPageNumber"],
                "paragraphCount": len(section_paragraphs),
                "pages": section_pages,
            }
        )

    return sections


def main() -> None:
    parser = argparse.ArgumentParser(description="Format extracted book JSON into sections.")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    book = json.loads(args.input.read_text(encoding="utf-8"))
    toc = parse_table_of_contents(book["pages"])
    book["tableOfContents"] = toc
    book["sections"] = format_sections(book, toc)

    args.output.write_text(json.dumps(book, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Formatted {len(book['sections'])} sections from {len(toc)} contents entries")


if __name__ == "__main__":
    main()
