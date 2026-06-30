import argparse
import io
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

import fitz
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"


def clean_text(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def ocr_page(page, page_number: int, dpi: int, lang: str) -> dict:
    pix = page.get_pixmap(dpi=dpi)
    img_bytes = pix.pil_tobytes(format="png")
    pil_img = Image.open(io.BytesIO(img_bytes))
    text = clean_text(pytesseract.image_to_string(pil_img, lang=lang))
    return {
        "pageNumber": page_number,
        "text": text,
        "characterCount": len(text),
    }


def extract_book(
    pdf_path: Path, slug: str, title: str, author: str, language: str, dpi: int = 300, lang: str = "eng"
) -> dict:
    document = fitz.open(pdf_path)
    total_pages = document.page_count
    pages = [None] * total_pages

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(ocr_page, document[i], i + 1, dpi, lang): i
            for i in range(total_pages)
        }
        for future in as_completed(futures):
            idx = futures[future]
            pages[idx] = future.result()

    document.close()

    return {
        "slug": slug,
        "title": title,
        "author": author,
        "language": language,
        "sourceFile": pdf_path.name,
        "extractedWith": f"TesseractOCR (dpi={dpi}, lang={lang})",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "pageCount": total_pages,
        "totalCharacterCount": sum(p["characterCount"] for p in pages),
        "pages": pages,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract PDF book text via OCR (for image-based PDFs)."
    )
    parser.add_argument("--pdf", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--author", required=True)
    parser.add_argument("--language", default="English")
    parser.add_argument("--dpi", type=int, default=300, help="DPI for rendering (default: 300)")
    parser.add_argument("--lang", default="eng", help="Tesseract language code (default: eng)")
    parser.add_argument("--workers", type=int, default=4, help="Parallel workers (default: 4)")
    args = parser.parse_args()

    book = extract_book(
        args.pdf, args.slug, args.title, args.author, args.language, args.dpi, args.lang
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(book, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(
        f"OCR extracted {book['pageCount']} pages and "
        f"{book['totalCharacterCount']} characters to {args.output}"
    )


if __name__ == "__main__":
    main()
