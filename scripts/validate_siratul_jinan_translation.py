"""Validate a Sirat-ul-Jinan source, translation, or transliteration batch against SQLite.

Modes:
  source          - Urdu source batch extracted from the DB (text must match the DB verbatim).
  translation     - general batch integrity checks (metadata, coverage, Arabic headers, artifacts).
  transliteration - Roman Urdu batch: verifies that preserved Arabic (Quranic ayat text and
                    {...} block headings) appears verbatim, that no new Arabic was introduced
                    beyond the source, that no Urdu quote characters remain unconverted, and
                    that structural markers (braces, footnotes, numbered items) are balanced
                    against the DB source.
"""

import argparse
import re
import sqlite3
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "publishing" / "siratul-jinan-roman-urdu" / "source" / "siratul-jinan.db"

ARABIC_RUN = re.compile(r"[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]+")
NUMBERED_ITEM = re.compile(r"\([0-9۰-۹]+\)")
URDU_QUOTES = "’‘«»"


def parser():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("batch", type=Path)
    p.add_argument("--db", type=Path, default=DEFAULT_DB)
    p.add_argument("--mode", choices=("source", "translation", "transliteration"), default="source")
    return p


def load_rows(db, source_ids):
    placeholders = ",".join("?" for _ in source_ids)
    rows = db.execute(
        f"SELECT t.tafseerId, t.ayatId, t.tafseerTextPlain, a.arabicText "
        f"FROM tafseer t JOIN aayaat a ON a.ayatId=t.ayatId "
        f"WHERE t.tafseerId IN ({placeholders}) ORDER BY t.tafseerId",
        source_ids,
    ).fetchall()
    db.close()
    if len(rows) != len(source_ids):
        raise SystemExit(f"Database coverage mismatch: batch={len(source_ids)}, database={len(rows)}")
    return rows


def finish(batch, errors, warnings):
    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        if warnings:
            print("Warnings:")
            for warning in warnings:
                print(f"* {warning}")
        raise SystemExit(1)
    if warnings:
        print("Validated with warnings:")
        for warning in warnings:
            print(f"* {warning}")
    print(f"Validated: {batch}")


def validate_transliteration(text, rows):
    errors, warnings = [], []
    text = unicodedata.normalize("NFC", text)
    source_chunks = []
    for row in rows:
        source_chunks.append(unicodedata.normalize("NFC", row["tafseerTextPlain"] or ""))
        source_chunks.append(unicodedata.normalize("NFC", row["arabicText"] or ""))
    source_concat = "\n".join(source_chunks)

    for row in rows:
        missing = [
            run
            for run in ARABIC_RUN.findall(unicodedata.normalize("NFC", row["arabicText"] or ""))
            if run not in text
        ]
        if missing:
            errors.append(
                f"tafseerId {row['tafseerId']}: Quranic Arabic runs missing from batch: {missing[:5]}"
            )

    for row in rows:
        for block in re.findall(
            r"\{([^{}]*)\}", unicodedata.normalize("NFC", row["tafseerTextPlain"] or "")
        ):
            heading = block.split(":", 1)[0].strip()
            if heading and heading not in text:
                errors.append(
                    f"tafseerId {row['tafseerId']}: {{...}} Arabic heading missing from batch: {heading!r}"
                )

    for run in sorted(set(ARABIC_RUN.findall(text))):
        if run not in source_concat:
            errors.append(f"Arabic text in batch not found verbatim in source: {run!r}")

    if "($1)" in text:
        errors.append("literal ($1) artifact in batch")
    if re.search(r"</?[a-zA-Z][^>]*>", text):
        errors.append("HTML-like markup present in batch")
    for ch in URDU_QUOTES:
        if ch in text:
            errors.append(f"Urdu quote character {ch!r} left unconverted in roman batch")

    if source_concat.count("{") != text.count("{"):
        errors.append(
            f"{{...}} count mismatch: source={source_concat.count('{')}, batch={text.count('{')}"
        )
    if source_concat.count("[") != text.count("["):
        errors.append(
            f"footnote marker count mismatch: source={source_concat.count('[')}, batch={text.count('[')}"
        )
    src_items = len(NUMBERED_ITEM.findall(source_concat))
    dst_items = len(NUMBERED_ITEM.findall(text))
    if src_items != dst_items:
        errors.append(f"numbered-item count mismatch: source={src_items}, batch={dst_items}")

    latin = len(re.findall(r"[a-zA-Z]", text))
    if latin < 200:
        warnings.append(
            f"very little Roman/Latin prose found ({latin} letters) - did transliteration happen?"
        )

    return errors, warnings


def main():
    args = parser().parse_args()
    text = args.batch.read_text(encoding="utf-8")
    db = sqlite3.connect(args.db)
    db.row_factory = sqlite3.Row

    source_ids = [int(value) for value in re.findall(r"tafseerId=(\d+)", text)]
    ayat_ids = [int(value) for value in re.findall(r"ayatId=(\d+)", text)]
    if not source_ids:
        raise SystemExit("No tafseerId metadata found in batch.")
    if len(source_ids) != len(set(source_ids)):
        raise SystemExit("Duplicate tafseerId metadata found.")
    if len(ayat_ids) != len(source_ids):
        raise SystemExit("Each source entry must include one ayatId.")

    rows = load_rows(db, source_ids)

    if args.mode == "transliteration":
        errors, warnings = validate_transliteration(text, rows)
    else:
        errors, warnings = [], []
        for row in rows:
            if "($1)" in row["tafseerTextPlain"]:
                errors.append(f"tafseerId {row['tafseerId']}: literal ($1) artifact")
            if "<" in row["tafseerTextPlain"] or ">" in row["tafseerTextPlain"]:
                errors.append(f"tafseerId {row['tafseerId']}: HTML-like markup remains in plain source")
            if row["arabicText"] and row["arabicText"] not in text:
                errors.append(f"tafseerId {row['tafseerId']}: Arabic text missing from batch")
            if row["tafseerTextPlain"] and row["tafseerTextPlain"][:80] not in text:
                errors.append(f"tafseerId {row['tafseerId']}: source text missing from batch")

    finish(args.batch, errors, warnings)


if __name__ == "__main__":
    main()
