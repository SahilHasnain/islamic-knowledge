import argparse
import difflib
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import fitz


CATALOGUE_PATTERN = re.compile(
    r"our books in roman urdu|our other publications|publisher'?s catalogue|"
    r"donate|abde mustafa publications",
    re.IGNORECASE,
)
HONORIFIC_PATTERN = re.compile(r"مَی[\s\u0600-\u06ff]{0,160}صَلَّی?")
TOC_LINE_PATTERN = re.compile(r"^\s*(.*?)\s*\.{3,}\s*(\d{1,3})\s*$")
TOC_PAGE_GLUE_PATTERN = re.compile(r"\s*\.{0,}\s*(\d{1,3})\s+(?=(?:Note\b|Hadees\b))", re.IGNORECASE)


def clean_toc_title(title: str, printed_page: int | None) -> str:
    title = title.strip()
    if printed_page is not None:
        title = re.sub(rf"\.+\s*{printed_page}\s+.*$", "", title)
        title = re.sub(
            rf"\s*\.*\s*{printed_page}\s+(?=(?:Note\b|Hadees\b)).*$",
            "",
            title,
            flags=re.IGNORECASE,
        )
    title = TOC_PAGE_GLUE_PATTERN.sub(" ", title)
    title = re.sub(r"\s+Note\s+Zaroori\s*:?\s*$", "", title, flags=re.IGNORECASE)
    return re.sub(r"\s+", " ", title).strip(" .:")


def match_title_for(title: str) -> str:
    key = normalized(title)
    if key.startswith("kashtikadesignallah"):
        return "Kashti ka design ALLAH TA’ALA ki 'wahee' aur Jibreel ki muawanat (madad) se taiyar hua"
    if key.startswith("neklogonkeqareebmutabarrakmaqamaatmein"):
        return "Nek logon ke qareeb mutabarrak maqamaat mein kisi ko dafan karna amre mustahab hai"
    if key.startswith("nabikareemaurtamamambiya") and "tangisemehfooz" in key:
        return "Nabi Kareem ﷺ aur tamam Ambiya -e- kiraam alaihimussalam qabr ki tangi se mehfooz"
    if key.startswith("allahnehuzoor") and "izatakleef" in key:
        return "ALLAH TA’ALA ne Huzoor ﷺ ko iza (takleef) pahunchana haraam wa baa'is e laanat qaraar diya"
    if key.startswith("quraishkaahednaama") and "shebeabutaalib" in key:
        return "Quraish ka ahed naama deal muahida aur Huzoor ﷺ ka shebe abu taalib mein maqayyad hona"
    return title


def normalized(text: str) -> str:
    return "".join(char.lower() for char in text if char.isascii() and char.isalnum())


def normalized_offsets(text: str) -> tuple[str, list[int]]:
    chars = []
    offsets = []
    for index, char in enumerate(text):
        if char.isascii() and char.isalnum():
            chars.append(char.lower())
            offsets.append(index)
    return "".join(chars), offsets


def repair_honorifics(text: str) -> str:
    return HONORIFIC_PATTERN.sub("ﷺ", text)


def printed_page(text: str, title: str) -> int | None:
    title_key = normalized(title)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    for index, line in enumerate(lines[:8]):
        line_key = normalized(line)
        if not title_key or title_key not in line_key:
            continue
        trailing = re.search(r"(?:^|\s)(\d{1,3})\s*$", line)
        if trailing:
            return int(trailing.group(1))
        for next_line in lines[index + 1:index + 5]:
            if next_line.isdigit():
                return int(next_line)
            if len(next_line) > 24:
                break
    return None


def clean_page_text(text: str, title: str) -> str:
    text = repair_honorifics(text)
    lines = text.splitlines()
    title_key = normalized(title)
    for index, line in enumerate(lines[:8]):
        if title_key and title_key in normalized(line):
            lines.pop(index)
            for next_index, candidate in enumerate(lines[:5]):
                if not candidate.strip():
                    continue
                if re.fullmatch(r"\s*\d{1,3}\s*", candidate):
                    lines.pop(next_index)
                    break
                if len(candidate.strip()) > 24:
                    break
            break
    return "\n".join(lines).strip()


def read_pages(pdf: fitz.Document, legacy: dict | None, title: str) -> list[dict]:
    if legacy is not None:
        if legacy.get("pageCount") != pdf.page_count:
            raise ValueError("The existing extraction page count does not match the PDF.")
        if len(legacy.get("pages", [])) != pdf.page_count:
            raise ValueError("The existing extraction does not contain every PDF page.")
        return [
            {
                "pdfPage": page["pageNumber"],
                "printedPage": printed_page(page.get("text", ""), title),
                "text": repair_honorifics(page.get("text", "")),
            }
            for page in legacy["pages"]
        ]

    pages = []
    for pdf_page, page in enumerate(pdf, start=1):
        text = page.get_text("text", sort=True)
        pages.append(
            {
                "pdfPage": pdf_page,
                "printedPage": printed_page(text, title),
                "text": repair_honorifics(text),
            }
        )
    return pages


def parse_toc(pages: list[dict], legacy: dict | None, first_body_pdf_page: int) -> tuple[list[dict], set[int]]:
    if legacy and legacy.get("tableOfContents"):
        toc = [
            {
                "title": clean_toc_title(entry["title"], entry.get("printedPageNumber")),
                "matchTitle": match_title_for(clean_toc_title(entry["title"], entry.get("printedPageNumber"))),
                "printedPage": entry.get("printedPageNumber"),
                "pdfPage": entry.get("pdfPageNumber"),
            }
            for entry in legacy["tableOfContents"]
        ]
        contents_pages = set()
        for page in pages:
            if page["pdfPage"] >= first_body_pdf_page:
                continue
            if len(re.findall(r"\.{3,}\s*\d{1,3}", page["text"])) >= 2:
                contents_pages.add(page["pdfPage"])
        return toc, contents_pages

    toc = []
    contents_pages = set()
    for page in pages:
        if page["pdfPage"] > 45:
            continue
        pending_title = ""
        page_has_entries = False
        for line in page["text"].splitlines():
            match = TOC_LINE_PATTERN.fullmatch(line)
            if match:
                heading = match.group(1).strip() or pending_title
                if heading:
                    toc.append(
                        {
                            "title": clean_toc_title(heading, int(match.group(2))),
                            "matchTitle": clean_toc_title(heading, int(match.group(2))),
                            "printedPage": int(match.group(2)),
                            "pdfPage": None,
                        }
                    )
                    page_has_entries = True
                pending_title = ""
            elif line.strip():
                pending_title = line.strip()
        if page_has_entries:
            contents_pages.add(page["pdfPage"])
    return toc, contents_pages


def locate_headings(pages: list[dict], toc: list[dict], offset: int) -> list[tuple[int, int, int]]:
    page_by_number = {page["pdfPage"]: page for page in pages}
    page_cache = {
        page["pdfPage"]: normalized_offsets(page["bodyText"])
        for page in pages
    }
    located = []
    last_page = 0
    last_normalized_position = 0

    for section_no, entry in enumerate(toc, start=1):
        title = entry["title"]
        needle = normalized(entry.get("matchTitle", title))
        if not needle:
            raise ValueError(f"TOC entry has no searchable title: {title!r}")

        target = entry.get("pdfPage")
        if target is None:
            printed = entry.get("printedPage")
            if printed is None:
                raise ValueError(f"TOC entry has no page reference: {title}")
            target = printed + offset

        candidates = sorted(
            {
                page_no
                for page_no in (target - 2, target - 1, target, target + 1, target + 2)
                if page_no in page_by_number and page_no >= last_page
            },
            key=lambda page_no: (abs(page_no - target), page_no),
        )
        match = None
        for page_no in candidates:
            text, char_offsets = page_cache[page_no]
            start_at = last_normalized_position if page_no == last_page else 0
            search_at = start_at
            while True:
                position = text.find(needle, search_at)
                if position < 0:
                    break
                char_offset = char_offsets[position]
                line_prefix = page_by_number[page_no]["bodyText"].rsplit("\n", 1)[-1] if char_offset == 0 else ""
                raw_prefix = page_by_number[page_no]["bodyText"][:char_offset]
                line_start = not raw_prefix.rsplit("\n", 1)[-1].strip()
                if line_start or not line_prefix:
                    match = (page_no, position)
                    break
                search_at = position + 1
            if match:
                break

        if match is None:
            for page_no in sorted(page_by_number):
                if page_no < last_page:
                    continue
                text, char_offsets = page_cache[page_no]
                start_at = last_normalized_position if page_no == last_page else 0
                position = text.find(needle, start_at)
                if position >= 0:
                    match = (page_no, position)
                    break

        if match is None:
            fuzzy = None
            threshold = 0.9 if len(needle) < 24 else 0.84
            for page_no in candidates:
                text, _ = page_cache[page_no]
                start_at = last_normalized_position if page_no == last_page else 0
                lower = max(start_at, 0)
                upper = min(len(text), start_at + len(needle) + 20)
                for position in range(lower, max(lower, upper - len(needle) + 1)):
                    window = text[position:position + len(needle)]
                    score = difflib.SequenceMatcher(None, needle, window).ratio()
                    if score >= threshold and (fuzzy is None or score > fuzzy[0]):
                        fuzzy = (score, page_no, position)
            if fuzzy:
                match = (fuzzy[1], fuzzy[2])
                display_title = title.encode("ascii", "backslashreplace").decode("ascii")
                print(f"Fuzzy TOC heading match ({fuzzy[0]:.2f}): {display_title}")
            else:
                fallback_page = target if target in page_by_number and target >= last_page else next(
                    (page_no for page_no in sorted(page_by_number) if page_no >= last_page), None
                )
                if fallback_page is None:
                    raise ValueError(f"Could not locate TOC heading {section_no}/{len(toc)}: {title}")
                match = (fallback_page, 0)
                display_title = title.encode("ascii", "backslashreplace").decode("ascii")
                print(f"TOC heading text not found; using start of source page {fallback_page}: {display_title}")

        page_no, normalized_position = match
        char_offset = page_cache[page_no][1][normalized_position]
        located.append((page_no, char_offset, section_no))
        last_page = page_no
        last_normalized_position = normalized_position + len(needle)

    return located


def discover_offset(pages: list[dict], toc: list[dict]) -> int:
    offsets = [
        entry["pdfPage"] - entry["printedPage"]
        for entry in toc
        if entry.get("pdfPage") is not None and entry.get("printedPage") is not None
    ]
    if not offsets:
        offsets = [
            page["pdfPage"] - page["printedPage"]
            for page in pages
            if page.get("printedPage") is not None
        ]
    if not offsets:
        raise ValueError("Could not establish the printed-page to PDF-page mapping.")
    return Counter(offsets).most_common(1)[0][0]


def build_sections(pages: list[dict], toc: list[dict], locations: list[tuple[int, int, int]]) -> list[dict]:
    starts_by_page = {}
    for page_no, offset, section_no in locations:
        starts_by_page.setdefault(page_no, []).append((offset, section_no))

    title_by_no = {index: entry["title"] for index, entry in enumerate(toc, start=1)}
    sections = {
        index: {
            "sectionNo": index,
            "slug": re.sub(r"[^a-z0-9]+", "-", normalized(title)).strip("-") or f"section-{index}",
            "title": title,
            "startPdfPage": None,
            "endPdfPage": None,
            "startPrintedPage": toc[index - 1].get("printedPage"),
            "endPrintedPage": None,
            "blocks": [],
        }
        for index, title in title_by_no.items()
    }
    used_slugs = set()
    for section in sections.values():
        slug = section["slug"]
        if slug in used_slugs:
            slug = f"{slug}-{section['sectionNo']}"
            section["slug"] = slug
        used_slugs.add(slug)

    current_section = None
    first_event_page = min(page for page, _, _ in locations)
    last_event_page = max(page for page, _, _ in locations)
    content_end_page = max((page["pdfPage"] for page in pages if page["text"].strip()), default=last_event_page)
    cutoff = None
    for page in pages:
        if page["pdfPage"] <= last_event_page:
            continue
        for match in CATALOGUE_PATTERN.finditer(page["bodyText"]):
            cutoff = (page["pdfPage"], match.start())
            break
        if cutoff:
            break
    if cutoff:
        content_end_page = cutoff[0]

    for page in pages:
        page_no = page["pdfPage"]
        if page_no < first_event_page or page_no > content_end_page:
            continue
        text = page["bodyText"]
        if not text:
            continue
        page_limit = cutoff[1] if cutoff and page_no == cutoff[0] else len(text)
        events = sorted(starts_by_page.get(page_no, []))
        boundaries = [(0, None)]
        boundaries.extend(events)
        boundaries.append((page_limit, None))
        for index in range(len(boundaries) - 1):
            start_offset, section_no = boundaries[index]
            end_offset = boundaries[index + 1][0]
            if section_no is not None:
                current_section = section_no
            fragment = text[start_offset:end_offset].strip()
            if not fragment or current_section is None:
                continue
            section = sections[current_section]
            if section["startPdfPage"] is None:
                section["startPdfPage"] = page_no
            section["endPdfPage"] = page_no
            section["endPrintedPage"] = page.get("printedPage")
            section["blocks"].append(
                {
                    "sequenceNo": len(section["blocks"]) + 1,
                    "blockType": "content",
                    "pdfPage": page_no,
                    "printedPage": page.get("printedPage"),
                    "text": fragment,
                }
            )

    result = list(sections.values())
    empty = [section["title"] for section in result if not section["blocks"]]
    if empty:
        raise ValueError(f"TOC headings produced empty sections: {empty[:10]}")
    return result


def write_json(path: Path, book: dict) -> None:
    lines = ["{"]
    items = list(book.items())
    for index, (key, value) in enumerate(items):
        comma = "," if index + 1 < len(items) else ""
        key_text = json.dumps(key, ensure_ascii=False)
        if key == "sections":
            lines.append(f"  {key_text}: [")
            for section_no, section in enumerate(value):
                suffix = "," if section_no + 1 < len(value) else ""
                lines.append("    " + json.dumps(section, ensure_ascii=False) + suffix)
            lines.append("  ]" + comma)
        else:
            lines.append(f"  {key_text}: {json.dumps(value, ensure_ascii=False)}{comma}")
    lines.append("}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract a book into complete TOC-based logical sections.")
    parser.add_argument("--pdf", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--legacy-json", type=Path)
    parser.add_argument("--slug")
    parser.add_argument("--title")
    parser.add_argument("--author")
    parser.add_argument("--language", default="Roman Urdu")
    args = parser.parse_args()

    document = fitz.open(args.pdf)
    legacy = json.loads(args.legacy_json.read_text(encoding="utf-8")) if args.legacy_json else None
    if legacy and (legacy.get("pageCount") != document.page_count or legacy.get("sourceFile") != args.pdf.name):
        parser.error("Legacy extraction page count/source filename does not match the requested PDF.")

    slug = args.slug or legacy["slug"]
    title = args.title or legacy["title"]
    author = args.author or (legacy.get("author") if legacy else "")
    language = args.language or (legacy.get("language") if legacy else "Roman Urdu")
    pages = read_pages(document, legacy, title)
    page_map_numbers = [page.get("printedPage") for page in pages]
    provisional_offset = 0

    first_legacy_body_page = min(
        (entry.get("pdfPageNumber") for entry in (legacy or {}).get("tableOfContents", []) if entry.get("pdfPageNumber")),
        default=46,
    )
    toc, contents_pages = parse_toc(pages, legacy, first_legacy_body_page)
    toc = [entry for entry in toc if not CATALOGUE_PATTERN.search(entry["title"])]
    if not toc:
        parser.error("No usable table-of-contents entries were found.")
    provisional_offset = discover_offset(pages, toc)
    for entry in toc:
        if entry.get("pdfPage") is None:
            entry["pdfPage"] = entry["printedPage"] + provisional_offset

    first_body_pdf_page = min(entry["pdfPage"] for entry in toc)
    for page in pages:
        page["bodyText"] = clean_page_text(page["text"], title)
        if page["printedPage"] is None and page["pdfPage"] >= first_body_pdf_page:
            page["printedPage"] = page["pdfPage"] - provisional_offset

    locations = locate_headings(pages, toc, provisional_offset)
    sections = build_sections(pages, toc, locations)

    # Cut publisher catalogues and blank tail pages after the final reading section.
    last_body_page = max(section["endPdfPage"] for section in sections)
    first_body_page = min(section["startPdfPage"] for section in sections)
    body_pages = {block["pdfPage"] for section in sections for block in section["blocks"]}
    page_map = []
    for page in pages:
        page_no = page["pdfPage"]
        if page_no in body_pages:
            kind = "body"
        elif page_no in contents_pages:
            kind = "contents"
        elif page_no < first_body_page:
            kind = "frontmatter"
        else:
            kind = "backmatter"
        page_map.append({"pdfPage": page_no, "printedPage": page.get("printedPage"), "kind": kind})

    front_matter = [
        {"pdfPage": page["pdfPage"], "printedPage": page.get("printedPage"), "text": page["bodyText"]}
        for page in pages
        if page["pdfPage"] < first_body_page and page["text"].strip()
    ]
    first_location = locations[0]
    first_page = next(page for page in pages if page["pdfPage"] == first_location[0])
    first_page_prefix = first_page["bodyText"][:first_location[1]].strip()
    if first_page_prefix:
        front_matter.append(
            {
                "pdfPage": first_page["pdfPage"],
                "printedPage": first_page.get("printedPage"),
                "text": first_page_prefix,
            }
        )
    normalized_toc = [
        {
            "sectionNo": index,
            "title": entry["title"],
            "printedPage": entry.get("printedPage"),
            "pdfPage": locations[index - 1][0],
        }
        for index, entry in enumerate(toc, start=1)
    ]

    result = {
        "schemaVersion": 2,
        "slug": slug,
        "title": title,
        "author": author,
        "language": language,
        "sourceFile": args.pdf.name,
        "extractedWith": "PyMuPDF with TOC-guided logical-section boundaries",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "pageCount": document.page_count,
        "frontMatterPdfPages": first_body_page - 1,
        "frontMatter": front_matter,
        "toc": normalized_toc,
        "sections": sections,
        "pageMap": page_map,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    write_json(args.output, result)
    block_count = sum(len(section["blocks"]) for section in sections)
    print(
        f"Extracted {document.page_count} pages into {len(sections)} complete sections "
        f"with {block_count} page fragments from {args.pdf.name}."
    )


if __name__ == "__main__":
    main()
