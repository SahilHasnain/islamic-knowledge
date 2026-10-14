"""Remove source pagination labels from the reader-facing manuscript."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path("publishing/addawatul-makkiyyah-english-json/manuscript")
PRINTED_HEADING = re.compile(
    r"^(#{1,6}) Printed Pages? \d+(?:[–-]\d+)?(?: — (.*))?\s*$"
)
PRINTED_SUFFIX = re.compile(r"\s+— Printed Pages? \d+(?:[–-]\d+)?\s*$")


def clean_heading(line: str) -> str | None:
    match = PRINTED_HEADING.match(line)
    if match:
        level, title = match.groups()
        if not title or title.startswith(("Continuation of", "Through the ")):
            return None
        return f"{level} {title}"

    if line.startswith("#"):
        return PRINTED_SUFFIX.sub("", line)
    return line


def main() -> None:
    changed: list[Path] = []
    for path in ROOT.rglob("*.md"):
        original = path.read_text(encoding="utf-8")
        output: list[str] = []
        for line in original.splitlines():
            cleaned = clean_heading(line)
            if cleaned is not None:
                output.append(cleaned)
        text = "\n".join(output).rstrip() + "\n"
        text = re.sub(r"\n{3,}", "\n\n", text)
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed.append(path)

    for path in changed:
        print(path)
    print(f"Cleaned printed-page labels in {len(changed)} manuscript files.")


if __name__ == "__main__":
    main()
