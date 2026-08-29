#!/usr/bin/env python3
"""Extract a traceable Fatawa Razaviya source batch from SQLite.

The application calls the source-content table ``hadith``.  The Urdu source
text is stored in ``without_araab`` and references are stored in ``avidance``.
This script only extracts source data; it does not translate or rewrite it.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path


DEFAULT_DATABASE = (
    Path(__file__).resolve().parents[1]
    / "db/fatawa_e_razvia.db"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--volume-id", type=int, required=True)
    parser.add_argument("--lesson-id", type=int, required=True)
    parser.add_argument("--start-rowid", type=int)
    parser.add_argument("--end-rowid", type=int)
    parser.add_argument("--database", type=Path, default=DEFAULT_DATABASE)
    parser.add_argument("--output", type=Path)
    return parser.parse_args()


def extract(
    database: Path,
    volume_id: int,
    lesson_id: int,
    start_rowid: int | None = None,
    end_rowid: int | None = None,
) -> dict:
    connection = sqlite3.connect(database)
    connection.row_factory = sqlite3.Row
    try:
        lesson = connection.execute(
            """
            SELECT id, volume_id, lesson_name, is_resala
            FROM lesson
            WHERE id = ? AND volume_id = ?
            """,
            (lesson_id, volume_id),
        ).fetchone()
        if lesson is None:
            raise SystemExit(
                f"No lesson {lesson_id} found in volume {volume_id}: {database}"
            )

        query = """
            SELECT rowid, volume_id, lesson_id, chapter_id, sub_chapter_id,
                   hadith_no, without_araab, avidance
            FROM hadith
            WHERE volume_id = ? AND lesson_id = ?
        """
        parameters: list[int] = [volume_id, lesson_id]
        if start_rowid is not None:
            query += " AND rowid >= ?"
            parameters.append(start_rowid)
        if end_rowid is not None:
            query += " AND rowid <= ?"
            parameters.append(end_rowid)
        query += " ORDER BY rowid"
        rows = connection.execute(query, parameters).fetchall()
    finally:
        connection.close()

    return {
        "source_database": database.as_posix(),
        "volume_id": volume_id,
        "start_rowid": start_rowid,
        "end_rowid": end_rowid,
        "lesson": dict(lesson),
        "record_count": len(rows),
        "records": [dict(row) for row in rows],
    }


def main() -> None:
    args = parse_args()
    result = extract(
        args.database,
        args.volume_id,
        args.lesson_id,
        args.start_rowid,
        args.end_rowid,
    )
    rendered = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        args.output.write_text(rendered + "\n", encoding="utf-8")
    else:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8")
        print(rendered)


if __name__ == "__main__":
    main()
