import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import fitz


def clean_text(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_book(pdf_path: Path, slug: str, title: str, author: str, language: str) -> dict:
    document = fitz.open(pdf_path)
    pages = []

    for index, page in enumerate(document, start=1):
        text = clean_text(page.get_text("text"))
        pages.append(
            {
                "pageNumber": index,
                "text": text,
                "characterCount": len(text),
            }
        )

    return {
        "slug": slug,
        "title": title,
        "author": author,
        "language": language,
        "sourceFile": pdf_path.name,
        "extractedWith": "PyMuPDF",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "pageCount": document.page_count,
        "totalCharacterCount": sum(page["characterCount"] for page in pages),
        "pages": pages,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract PDF book text with PyMuPDF.")
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

    print(
        f"Extracted {book['pageCount']} pages and "
        f"{book['totalCharacterCount']} characters to {args.output}"
    )


if __name__ == "__main__":
    main()
