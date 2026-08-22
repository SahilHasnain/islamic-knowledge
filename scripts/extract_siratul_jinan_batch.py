"""Extract a traceable Sirat-ul-Jinan transliteration batch from SQLite."""

import argparse
import os
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "publishing" / "siratul-jinan-roman-urdu" / "source" / "siratul-jinan.db"
DEFAULT_OUT = ROOT / "publishing" / "siratul-jinan-roman-urdu" / "manuscript" / "00-pilot" / "01-surah-al-fatihah.md"


def volume_for_para(para_no):
    return ((para_no - 1) // 3) + 1


def build_parser():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--surah", type=int, help="Filter by surah number")
    parser.add_argument("--para", type=int, help="Filter by para number")
    parser.add_argument("--ayat-start", type=int)
    parser.add_argument("--ayat-end", type=int)
    parser.add_argument("--limit", type=int)
    return parser


def main():
    args = build_parser().parse_args()
    if not args.db.exists():
        raise SystemExit(f"Database not found: {args.db}")

    db = sqlite3.connect(args.db)
    db.row_factory = sqlite3.Row

    clauses = []
    values = []
    if args.surah is not None:
        clauses.append("a.surahId = ?")
        values.append(args.surah)
    if args.para is not None:
        clauses.append("a.paraId = ?")
        values.append(args.para)
    if args.ayat_start is not None:
        clauses.append("a.ayatNumber >= ?")
        values.append(args.ayat_start)
    if args.ayat_end is not None:
        clauses.append("a.ayatNumber <= ?")
        values.append(args.ayat_end)

    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    limit = f"LIMIT {int(args.limit)}" if args.limit else ""
    rows = db.execute(
        f"""
        SELECT t.tafseerId, t.ayatId, t.tafseerNumber, t.tafseerTextPlain,
               a.ayatNumber, a.surahId, a.paraId, a.arabicText,
               s.roman_name, s.surahName, p.paraName
        FROM tafseer t
        JOIN aayaat a ON a.ayatId = t.ayatId
        JOIN surah s ON s.surahId = a.surahId
        JOIN para p ON p.paraId = a.paraId
        {where}
        ORDER BY a.paraId, a.surahId, a.ayatNumber, t.tafseerId
        {limit}
        """,
        values,
    ).fetchall()
    db.close()

    if not rows:
        raise SystemExit("No matching tafseer entries found.")

    first = rows[0]
    last = rows[-1]
    volume = volume_for_para(first["paraId"])
    output = [
        "# Sirat-ul-Jinan Roman Urdu Transliteration Batch",
        "",
        "> Status: extracted source batch; transliteration not yet started.",
        ">",
        f"> Volume: Jild {volume} | Para: {first['paraId']}",
        f"> Source entries: {len(rows)}",
        f"> Source IDs: tafseerId {first['tafseerId']}–{last['tafseerId']}; ayatId {first['ayatId']}–{last['ayatId']}",
        "",
        "## Source Entries",
        "",
    ]

    for row in rows:
        output.extend(
            [
                f"### {row['roman_name']} — Ayat {row['surahId']}:{row['ayatNumber']}",
                "",
                f"`Source: tafseerId={row['tafseerId']}; ayatId={row['ayatId']}; para={row['paraId']}; volume={volume}`",
                "",
                f"**Arabic:** {row['arabicText'] or '(Arabic text unavailable in source row)'}",
                "",
                "**Urdu source:**",
                "",
                row["tafseerTextPlain"].strip(),
                "",
            ]
        )

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text("\n".join(output).rstrip() + "\n", encoding="utf-8")
    print(f"Wrote {args.out} ({len(rows)} entries)")


if __name__ == "__main__":
    main()
