#!/usr/bin/env python3
"""Extract page-preserving Bahar-e-Shariat source records from SQLite."""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path


DEFAULT_DATABASE = Path(__file__).resolve().parents[1] / "db/Bahar_e_Shariat.db"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--volume", type=int, choices=(1, 2, 3), required=True)
    parser.add_argument("--start-page", type=int, required=True)
    parser.add_argument("--end-page", type=int, required=True)
    parser.add_argument("--database", type=Path, default=DEFAULT_DATABASE)
    parser.add_argument("--output", type=Path)
    return parser.parse_args()


def extract(database: Path, volume: int, start_page: int, end_page: int) -> dict:
    table = f"volume_{['one', 'two', 'three'][volume - 1]}"
    connection = sqlite3.connect(database)
    connection.row_factory = sqlite3.Row
    try:
        rows = connection.execute(
            f"SELECT page_number, section, text, text_with_html "
            f"FROM {table} WHERE page_number BETWEEN ? AND ? ORDER BY page_number",
            (start_page, end_page),
        ).fetchall()
        toc = connection.execute(
            """SELECT jild, section, page_number, heading, without_arab
               FROM table_of_contents
               WHERE jild = ? AND page_number <= ?
               ORDER BY page_number DESC LIMIT 1""",
            (volume, start_page),
        ).fetchone()
    finally:
        connection.close()

    return {
        "source_database": database.as_posix(),
        "volume": volume,
        "source_table": table,
        "start_page": start_page,
        "end_page": end_page,
        "record_count": len(rows),
        "toc_context": dict(toc) if toc else None,
        "records": [dict(row) for row in rows],
    }


def main() -> None:
    args = parse_args()
    result = extract(args.database, args.volume, args.start_page, args.end_page)
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8")
        print(rendered, end="")


if __name__ == "__main__":
    main()
