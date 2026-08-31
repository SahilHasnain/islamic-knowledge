"""Sort page entries in a Bahar manuscript by their explicit source marker."""

import re
import sys
from pathlib import Path


MARKER = re.compile(
    r"<!-- source_table=volume_one \| jild=1 \| section=1 \| page_number=(\d+) -->"
)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: reorder_bahar_manuscript_pages.py MANUSCRIPT")
    path = Path(sys.argv[1])
    text = path.read_text(encoding="utf-8")
    matches = list(MARKER.finditer(text))
    if not matches:
        raise SystemExit("no page markers found")
    prefix = text[: matches[0].start()]
    entries = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        entries.append((int(match.group(1)), text[match.start():end].strip()))
    entries.sort(key=lambda item: item[0])
    path.write_text(prefix.rstrip() + "\n\n" + "\n\n".join(entry for _, entry in entries) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
