"""Extract complete page records from the source book JSON for translation review."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("start", type=int, help="first JSON page number, inclusive")
    parser.add_argument("end", type=int, help="last JSON page number, inclusive")
    parser.add_argument("output", type=Path, help="Markdown output path")
    args = parser.parse_args()

    source = Path("content/books/addawatul-makkiyyah.json")
    data = json.loads(source.read_text(encoding="utf-8"))
    pages = [p for p in data["pages"] if args.start <= p["pageNumber"] <= args.end]
    expected = list(range(args.start, args.end + 1))
    found = [p["pageNumber"] for p in pages]
    if found != expected:
        raise SystemExit(f"Requested pages {expected}; found {found}")

    chunks = [
        f"# Source JSON Extraction — Pages {args.start}–{args.end}\n",
        f"Source: `{source}`\n",
        "> Verbatim source text. Translation must be made directly from this extraction.\n",
    ]
    for page in pages:
        text = page["text"].rstrip()
        chunks.append(f"## JSON Page {page['pageNumber']}\n\n{text}\n")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(chunks), encoding="utf-8")
    print(f"Extracted {len(pages)} complete records to {args.output}")


if __name__ == "__main__":
    main()
