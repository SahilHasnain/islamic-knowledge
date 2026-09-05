import argparse
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import fitz


def clean_text(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def is_poem_line(flags: int) -> bool:
    return (flags & 0x12) == 0x12


def page_lines(page: "fitz.Page") -> list[dict]:
    lines = []
    data = page.get_text("dict")
    for block in data["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            text = clean_text("".join(span["text"] for span in line["spans"]))
            if not text:
                continue
            x0, y0, x1, _ = line["bbox"]
            dominant = max(line["spans"], key=lambda s: len(s["text"]))
            size = dominant["size"]
            flags = dominant["flags"]
            lines.append(
                {
                    "x0": x0,
                    "y0": y0,
                    "x1": x1,
                    "size": size,
                    "flags": flags,
                    "text": text,
                }
            )
    return lines


def detect_running_header(lines_per_page: list[list[dict]], page_height: float) -> str | None:
    signatures = Counter()
    for lines in lines_per_page:
        for line in lines:
            if line["y0"] < page_height * 0.14:
                signatures[(line["text"], round(line["y0"] / 6))] += 1
    best, count = signatures.most_common(1)[0]
    threshold = max(4, int(len(lines_per_page) * 0.45))
    if count >= threshold and len(best[0]) >= 4 and not best[0].isdigit():
        return best[0]
    return None


def extract_printed_map(lines_per_page: list[list[dict]], page_height: float) -> dict[int, int]:
    printed_map = {}
    for index, lines in enumerate(lines_per_page, start=1):
        for line in lines:
            if line["y0"] >= page_height * 0.86 and line["text"].isdigit():
                printed_map[index] = int(line["text"])
                break
    return printed_map


def drop_frame_lines(
    lines: list[dict],
    page_height: float,
    header_text: str | None,
) -> tuple[list[dict], int | None]:
    content = []
    printed = None
    for line in lines:
        if header_text and line["y0"] < page_height * 0.14 and line["text"] == header_text:
            continue
        if line["y0"] >= page_height * 0.86 and line["text"].isdigit():
            printed = int(line["text"])
            continue
        content.append(line)
    return content, printed


def classify_line(line: dict) -> tuple[str | None, str, str]:
    text = line["text"]
    if kalaam_number(text) is not None:
        return "heading", "", text
    match = re.match(r"^\s*Mu[sh]{2}kil Alfaz\s*[:\-–]*\s*(.*)$", text)
    if match:
        return "glossary", match.group(0).strip(), match.group(1).strip()
    match = re.match(r"^\s*Mafhoom\s*[:\-–]*\s*(.*)$", text)
    if match:
        return "explanation", "Mafhoom :-", match.group(1).strip()
    if is_poem_line(line["flags"]):
        return "poem", "", text
    return None, "", text


def kalaam_number(text: str) -> int | None:
    match = re.fullmatch(r"\(\s*(\d{1,2})\s*\)", text)
    if not match:
        return None
    return int(match.group(1))


def parse_toc(flow: list[dict], max_sections: int) -> list[dict]:
    entries = []
    current = None
    fehrist_seen = False

    for line in flow:
        text = line["text"]
        if re.fullmatch(r"\s*Fehrist\s*", text):
            fehrist_seen = True
            continue
        if not fehrist_seen:
            continue

        toc_marker = re.fullmatch(r"\(\s*(\d{1,2})\s*\)\s*(.*)", text)
        if toc_marker:
            number = int(toc_marker.group(1))
            if number > max_sections:
                continue
            if current and "printedPage" in current:
                entries.append(current)
            current = {
                "sectionNo": number,
                "pdfPage": line["pdfPage"],
                "title_parts": [toc_marker.group(2).strip()],
            }
            continue

        if current is None:
            continue

        dotted = re.fullmatch(r"(.+?)\.{3,}\s*(\d{1,3})\s*", text)
        if dotted:
            current["title_parts"].append(dotted.group(1).strip())
            current["printedPage"] = int(dotted.group(2))
            entries.append(current)
            current = None
            continue
        current["title_parts"].append(text.strip())

    if current and "printedPage" in current:
        entries.append(current)

    toc = []
    for entry in entries:
        toc.append(
            {
                "sectionNo": entry["sectionNo"],
                "title": " ".join(p for p in entry["title_parts"] if p),
                "printedPage": entry["printedPage"],
                "pdfPage": entry["pdfPage"],
            }
        )
    return toc


def classify_blocks(section_lines: list[dict]) -> list[dict]:
    blocks = []
    buffer = None
    state = None

    def flush():
        nonlocal buffer
        if buffer is not None:
            blocks.append(buffer)
            buffer = None

    for line in section_lines:
        kind, heading, rest = classify_line(line)

        if kind == "heading":
            flush()
            buffer = {
                "blockType": "heading",
                "pdfPage": line["pdfPage"],
                "printedPage": line["printedPage"],
                "lines": [line["text"]],
            }
            state = None
            continue

        if kind == "glossary":
            flush()
            buffer = {
                "blockType": "glossary",
                "pdfPage": line["pdfPage"],
                "printedPage": line["printedPage"],
                "lines": [heading],
            }
            state = "glossary_item"
            if rest:
                buffer = {
                    "blockType": "glossary_item",
                    "pdfPage": line["pdfPage"],
                    "printedPage": line["printedPage"],
                    "lines": [rest],
                }
            continue

        if kind == "explanation":
            flush()
            buffer = {
                "blockType": "explanation",
                "pdfPage": line["pdfPage"],
                "printedPage": line["printedPage"],
                "lines": [heading] + ([rest] if rest else []),
            }
            state = "explanation"
            continue

        if kind == "poem":
            flush()
            buffer = {
                "blockType": "poem",
                "pdfPage": line["pdfPage"],
                "printedPage": line["printedPage"],
                "lines": [line["text"]],
            }
            state = "poem"
            continue

        target = state if state is not None else "explanation"
        if buffer is not None and buffer["blockType"] == target:
            buffer["lines"].append(line["text"])
            continue

        flush()
        buffer = {
            "blockType": target,
            "pdfPage": line["pdfPage"],
            "printedPage": line["printedPage"],
            "lines": [line["text"]],
        }

    flush()
    return blocks


def sequential_markers(flow: list[dict], max_sections: int) -> list[tuple[int, int]]:
    markers = [
        (index, number)
        for index, line in enumerate(flow)
        if (number := kalaam_number(line["text"])) is not None and 1 <= number <= max_sections
    ]
    sequential = 0
    for index, (_, number) in enumerate(markers):
        if number == index + 1:
            sequential = index + 1
        elif index == 0 or number != markers[index - 1][1] + 1:
            break
    return markers[:sequential]


CATALOGUE_HEADING = re.compile(
    r"(our books in roman urdu|more books|publisher'?s catalogue|catalogue of|"
    r"muntakhab kitaaben|muntakhib kitaaben|tamam kitaben)",
    re.IGNORECASE,
)


def find_backmatter_start(flow: list[dict], last_marker_index: int) -> int:
    for line_index in range(last_marker_index + 1, len(flow)):
        text = flow[line_index]["text"]
        if kalaam_number(text) is not None:
            return line_index
        if CATALOGUE_HEADING.search(text):
            return line_index
    return len(flow)


def build_sections(
    flow: list[dict],
    printed_map: dict[int, int],
    front_matter_pages: int,
    max_sections: int,
) -> list[dict]:
    markers = sequential_markers(flow, max_sections)
    body_cutoff = len(flow)
    if markers:
        body_cutoff = find_backmatter_start(flow, markers[-1][0])

    sections = []
    for marker_index, (start_idx, number) in enumerate(markers):
        end_idx = markers[marker_index + 1][0] if marker_index < len(markers) - 1 else body_cutoff
        section_lines = [line for line in flow[start_idx:end_idx]]
        title_lines = []
        for line in section_lines[1:]:
            if classify_line(line)[0] != "poem":
                break
            title_lines.append(line["text"])

        blocks = classify_blocks(section_lines)

        start_pdf = flow[start_idx]["pdfPage"]
        end_pdf = max((block["pdfPage"] for block in blocks), default=start_pdf)
        start_printed = printed_map.get(start_pdf, start_pdf - front_matter_pages)
        end_printed = printed_map.get(end_pdf, end_pdf - front_matter_pages)

        sections.append(
            {
                "sectionNo": number,
                "title": " ".join(title_lines).strip(),
                "startPdfPage": start_pdf,
                "endPdfPage": end_pdf,
                "startPrintedPage": start_printed,
                "endPrintedPage": end_printed,
                "blocks": [
                    {
                        "sequenceNo": index + 1,
                        "blockType": block["blockType"],
                        "pdfPage": block["pdfPage"],
                        "printedPage": block["printedPage"],
                        "text": "\n".join(block["lines"]).strip(),
                    }
                    for index, block in enumerate(blocks)
                ],
            }
        )

    return sections


def extract_book(pdf_path: Path, slug: str, title: str, author: str, language: str) -> dict:
    document = fitz.open(pdf_path)
    page_height = document[0].rect.height

    raw_lines = [page_lines(page) for page in document]

    header_text = detect_running_header(raw_lines, page_height)
    printed_map = extract_printed_map(raw_lines, page_height)

    front_matter_pages = 0
    flow = []
    for index, lines in enumerate(raw_lines, start=1):
        content, printed = drop_frame_lines(lines, page_height, header_text)
        if printed is not None:
            printed_map[index] = printed
        for line in content:
            if kalaam_number(line["text"]) == 1:
                front_matter_pages = index - 1
            flow.append(
                {
                    "pdfPage": index,
                    "printedPage": printed,
                    "x0": line["x0"],
                    "y0": line["y0"],
                    "flags": line["flags"],
                    "text": line["text"],
                }
            )

    for line in flow:
        if line["printedPage"] is None:
            line["printedPage"] = line["pdfPage"] - front_matter_pages

    toc = parse_toc(flow, 25)
    sections = build_sections(flow, printed_map, front_matter_pages, 25)

    markers = sequential_markers(flow, 25)
    backmatter_start = find_backmatter_start(flow, markers[-1][0]) if markers else len(flow)
    backmatter_pdf = flow[backmatter_start]["pdfPage"] if backmatter_start < len(flow) else document.page_count + 1

    page_map = []
    for index, lines in enumerate(raw_lines, start=1):
        if index <= front_matter_pages:
            kind = "frontmatter"
        elif index >= backmatter_pdf:
            kind = "backmatter"
        else:
            kind = "body"
        page_map.append(
            {
                "pdfPage": index,
                "printedPage": printed_map.get(index),
                "kind": kind,
            }
        )

    return {
        "schemaVersion": 2,
        "slug": slug,
        "title": title,
        "author": author,
        "language": language,
        "sourceFile": pdf_path.name,
        "extractedWith": "layout-aware PyMuPDF extractor (sqlite-friendly)",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "pageCount": document.page_count,
        "frontMatterPdfPages": front_matter_pages,
        "toc": toc,
        "sections": sections,
        "pageMap": page_map,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract PDF book content into sqlite-friendly JSON.")
    parser.add_argument("--pdf", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--author", required=True)
    parser.add_argument("--language", default="Urdu / English")
    args = parser.parse_args()

    book = extract_book(args.pdf, args.slug, args.title, args.author, args.language)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(book, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    blocks = sum(len(section["blocks"]) for section in book["sections"])
    print(
        f"Extracted {book['pageCount']} pages, {len(book['sections'])} sections, "
        f"{blocks} blocks, {len(book['toc'])} toc entries to {args.output}"
    )


if __name__ == "__main__":
    main()