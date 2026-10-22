"""Render first-page cover images for books whose source PDFs are available."""

import argparse
import json
from pathlib import Path

import fitz


REPOSITORY = Path(__file__).resolve().parents[1]
BOOKS_DIR = REPOSITORY / "content" / "books"
COVERS_DIR = REPOSITORY / "content" / "covers"


def find_source_pdfs(downloads: Path) -> dict[str, Path]:
    """Index PDFs recursively by exact, case-insensitive filename."""
    return {
        path.name.casefold(): path
        for path in downloads.rglob("*")
        if path.is_file() and path.suffix.casefold() == ".pdf"
    }


def generate(downloads: Path, output_dir: Path, overwrite: bool = False) -> tuple[int, int]:
    sources = find_source_pdfs(downloads)
    generated = 0
    skipped = 0
    output_dir.mkdir(parents=True, exist_ok=True)

    for book_path in sorted(BOOKS_DIR.glob("*.json")):
        book = json.loads(book_path.read_text(encoding="utf-8"))
        source_name = book.get("sourceFile")
        if not source_name:
            print(f"SKIP {book['slug']}: no sourceFile in book JSON")
            skipped += 1
            continue

        pdf_path = sources.get(Path(source_name).name.casefold())
        if pdf_path is None:
            print(f"SKIP {book['slug']}: source PDF not found: {source_name}")
            skipped += 1
            continue

        output_path = output_dir / f"{book['slug']}.png"
        if output_path.exists() and not overwrite:
            print(f"SKIP {book['slug']}: cover already exists (use --overwrite to replace)")
            skipped += 1
            continue

        try:
            with fitz.open(pdf_path) as document:
                if document.page_count == 0:
                    raise ValueError("PDF contains no pages")
                # The publisher's cover is the first PDF page, including image-only covers.
                pixmap = document[0].get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                pixmap.save(output_path)
        except Exception as error:
            print(f"SKIP {book['slug']}: could not render {pdf_path.name}: {error}")
            skipped += 1
            continue

        print(f"CREATED {output_path} from {pdf_path.name}")
        generated += 1

    return generated, skipped


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--downloads",
        type=Path,
        default=Path.home() / "Downloads",
        help="Downloads directory to search recursively (default: ~/Downloads).",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=COVERS_DIR,
        help="Cover image destination (default: content/covers).",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace existing cover images.",
    )
    args = parser.parse_args()
    generated, skipped = generate(args.downloads, args.output_dir, args.overwrite)
    print(f"Done: generated {generated} covers; skipped {skipped} books.")


if __name__ == "__main__":
    main()
