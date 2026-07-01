#!/usr/bin/env python3
"""Extract clean text from Shifa Shareef English manuscript for training corpus."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANUSCRIPT_DIR = ROOT / "publishing" / "shifa-shareef-english" / "manuscript"
OUTPUT = Path(__file__).parent / "data" / "corpus.txt"

MANUSCRIPT_FILES = [
    "00-front-matter/03-about-author.md",
    "00-front-matter/04-about-urdu-translator.md",
    "00-front-matter/05-introduction.md",
    "01-part-one/01-chapter-one.md",
    "01-part-one/02-chapter-two.md",
    "01-part-one/03-chapter-three.md",
    "01-part-one/04-chapter-four.md",
    "02-part-two/01-chapter-one.md",
    "02-part-two/02-chapter-two.md",
    "02-part-two/03-chapter-three.md",
    "02-part-two/04-chapter-four.md",
    "03-part-three/01-chapter-one.md",
    "03-part-three/02-chapter-two.md",
    "04-part-four/01-chapter-one.md",
    "04-part-four/02-chapter-two.md",
    "04-part-four/03-chapter-three.md",
    "90-back-matter/01-glossary.md",
    "90-back-matter/02-index-notes.md",
]

def strip_markdown(text):
    """Remove markdown formatting, keep structure."""
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)       # **bold**
    text = re.sub(r"\*([^*]+)\*", r"\1", text)             # *italic*
    text = re.sub(r"`([^`]+)`", r"\1", text)               # `code`
    text = re.sub(r"<sup>([^<]+)</sup>", r"[\1]", text)    # <sup> tags
    text = re.sub(r"<[^>]+>", "", text)                     # any remaining HTML tags
    text = re.sub(r"^\s*[-*]\s+", "• ", text, flags=re.MULTILINE)  # list items
    text = re.sub(r"^\d+\.\s+", "", text, flags=re.MULTILINE)      # numbered lists
    text = re.sub(r"\n{3,}", "\n\n", text)                  # normalize whitespace
    return text.strip()

def build_corpus():
    sections = []
    for filepath in MANUSCRIPT_FILES:
        full = MANUSCRIPT_DIR / filepath
        if not full.exists():
            print(f"WARNING: {full} not found", file=sys.stderr)
            continue
        raw = full.read_text(encoding="utf-8")
        clean = strip_markdown(raw)
        sections.append(clean)

    corpus = "\n\n\n".join(sections)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(corpus, encoding="utf-8")
    print(f"Wrote {OUTPUT} ({len(corpus):,} chars, ~{len(corpus.split()):,} words)")

if __name__ == "__main__":
    build_corpus()
