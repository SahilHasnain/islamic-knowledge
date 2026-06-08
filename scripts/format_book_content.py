import argparse
import json
import re
from pathlib import Path


def slugify(value: str) -> str:
    value = value.casefold()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "section"


def format_title(value: str) -> str:
    value = re.sub(r"^[•\s]+", "", value).strip()
    value = value.title()
    value = value.replace("'S", "'s")
    value = value.replace("-E-", "-e-")
    return value


def clean_page_text(text: str, book_header: str) -> str:
    lines = [line.strip() for line in text.splitlines()]

    while lines and not lines[0]:
      lines.pop(0)

    if lines and lines[0].casefold() == book_header.casefold():
        lines.pop(0)

    while lines and not lines[0]:
        lines.pop(0)

    if len(lines) >= 2 and len(lines[0]) <= 40 and re.fullmatch(r"\d+", lines[1]):
        lines.pop(0)
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


def parse_page_set(value: str) -> set[int]:
    pages = set()

    for part in value.split(","):
        part = part.strip()
        if "-" in part:
            start, end = part.split("-", 1)
            pages.update(range(int(start), int(end) + 1))
        elif part:
            pages.add(int(part))

    return pages


def parse_table_of_contents(
    pages: list[dict], toc_pdf_pages: set[int], page_offset: int, book_header: str
) -> list[dict]:
    entries = []
    pending_title = ""

    for page in pages:
        if page["pageNumber"] not in toc_pdf_pages:
            continue

        for line in page["text"].splitlines():
            stripped = line.strip()
            if not stripped:
                continue

            if stripped.casefold() in {"contents", book_header.casefold()}:
                pending_title = ""
                continue

            if re.fullmatch(r"\d+", stripped):
                pending_title = ""
                continue

            match = re.match(r"^(?P<title>.+?)\s*\.{3,}\s*(?P<page>\d+)\s*$", stripped)
            if not match:
                if not re.search(r"\.{3,}", stripped):
                    pending_title = f"{pending_title} {stripped}".strip()
                continue

            title = re.sub(r"\s+", " ", f"{pending_title} {match.group('title')}").strip(" .")
            pending_title = ""
            if not title or title.casefold() in {"contents", book_header.casefold()}:
                continue

            printed_page = int(match.group("page"))
            entries.append(
                {
                    "title": format_title(title),
                    "printedPageNumber": printed_page,
                    "pdfPageNumber": printed_page + page_offset,
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


def format_sections(book: dict, toc: list[dict], page_offset: int, book_header: str) -> list[dict]:
    pages_by_number = {page["pageNumber"]: page for page in book["pages"]}
    sections = []
    used_slugs = set()

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

            cleaned_text = clean_page_text(source_page["text"], book_header)
            paragraphs = text_to_paragraphs(cleaned_text)
            section_pages.append(
                {
                    "pageNumber": page_number,
                    "printedPageNumber": page_number - page_offset,
                    "text": cleaned_text,
                    "paragraphs": paragraphs,
                }
            )
            section_paragraphs.extend(paragraphs)

        base_slug = slugify(entry["title"])
        slug = base_slug
        suffix = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        used_slugs.add(slug)

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
    parser.add_argument("--book-header", required=True)
    parser.add_argument("--toc-pages", required=True, help="Comma-separated pages or ranges, e.g. 5-7,10")
    parser.add_argument("--page-offset", default=0, type=int)
    args = parser.parse_args()

    book = json.loads(args.input.read_text(encoding="utf-8"))
    toc = parse_table_of_contents(
        book["pages"], parse_page_set(args.toc_pages), args.page_offset, args.book_header
    )
    book["tableOfContents"] = toc
    book["sections"] = format_sections(book, toc, args.page_offset, args.book_header)

    args.output.write_text(json.dumps(book, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Formatted {len(book['sections'])} sections from {len(toc)} contents entries")


if __name__ == "__main__":
    main()
