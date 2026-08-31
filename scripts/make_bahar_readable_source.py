"""Create a page-separated, complete reading copy from a Bahar source JSON batch."""

import json
import sys
import textwrap
from pathlib import Path


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: make_bahar_readable_source.py INPUT_JSON OUTPUT_MD")

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    batch = json.loads(input_path.read_text(encoding="utf-8"))
    lines = [
        "# Complete Bahar-e-Shariat Source",
        "",
        f"Source JSON: `{input_path.as_posix()}`",
        f"Source table: `{batch['source_table']}`",
        f"Pages: {batch['start_page']}–{batch['end_page']}",
        "",
        "> This file is a complete reading copy. Preserve all text, citations, and footnotes during translation.",
        "",
    ]

    for record in batch["records"]:
        lines.extend(
            [
                f"<!-- source_table={batch['source_table']} | jild={record.get('jild', 1)} | section={record['section']} | page_number={record['page_number']} -->",
                f"## Page {record['page_number']}",
                "",
                *textwrap.wrap(
                    record["text"].strip(),
                    width=100,
                    break_long_words=False,
                    break_on_hyphens=False,
                ),
                "",
            ]
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
