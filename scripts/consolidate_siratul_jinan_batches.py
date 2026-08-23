"""Consolidate Sirat-ul-Jinan per-ayat transliteration batches into one surah manuscript file.

Merges every ``NN-*-roman.md`` batch in a surah directory into numbered append-only
manuscript parts. Entries from ``_inserts/insert-ayat-*.md`` are spliced in by ayat
number first. Verifies against the SQLite source that no tafseer entry is missing,
duplicated, misordered, or anchored to the wrong DB row. Note: tafseerIds are
NON-monotonic (late-added rows live at the end of the ID space), so ordering is
verified by ayat number and each (ayat -> tafseerId) pair is checked against the DB.
Originals are left untouched; archiving is a separate step.
"""

import argparse
import re
import sqlite3
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "publishing" / "siratul-jinan-roman-urdu" / "source" / "siratul-jinan.db"

ENTRY_HEADING = re.compile(r"^## Al-Baqarah — Ayat (\d+):(\d+)\s*$", re.M)
SOURCE_ID = re.compile(r"`Source: tafseerId=(\d+); ayatId=(\d+); para=(\d+); volume=(\d+)`")
BATCH_FILE = re.compile(r"^(\d+)-surah-.*-roman\.md$")
INSERT_FILE = re.compile(r"^insert-ayat-(\d+)\.md$")

SURAH_ID = 2  # Al-Baqarah
MAX_FILE_LINES = 2000


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("surah_dir", type=Path)
    ap.add_argument("--db", type=Path, default=DEFAULT_DB)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    db = sqlite3.connect(args.db)
    # ayat number -> tafseerId, authoritative mapping for this surah
    db_map = {
        num: tid
        for tid, num in db.execute(
            "SELECT t.tafseerId, a.ayatNumber FROM tafseer t"
            " JOIN aayaat a ON t.ayatId = a.ayatId WHERE a.surahId = ?",
            (SURAH_ID,),
        )
    }
    # ayatId lookup to cross-check the ayatId written in each Source line
    db_ayat_ids = dict(
        db.execute("SELECT ayatNumber, ayatId FROM aayaat WHERE surahId = ?", (SURAH_ID,))
    )

    batch_files = sorted(
        (
            p for p in args.surah_dir.rglob("*.md")  # includes _archive/ history
            if BATCH_FILE.match(p.name)
            and not p.name.endswith("surah-al-baqarah-roman.md")  # never re-ingest the legacy consolidated manuscript
        ),
        key=lambda p: (int(BATCH_FILE.match(p.name).group(1)), str(p)),
    )
    insert_files = sorted(
        p for p in (args.surah_dir / "_inserts").glob("insert-ayat-*.md")
        if INSERT_FILE.match(p.name)
    ) if (args.surah_dir / "_inserts").is_dir() else []
    if not batch_files:
        sys.exit(f"No roman batch files found in {args.surah_dir}")

    blocks = []  # (source_name, ayat_no, body)
    errors = []
    paras = set()
    seen_pairs = {}

    def collect(name, text):
        m = ENTRY_HEADING.search(text)
        if not m:
            errors.append(f"{name}: no '## Al-Baqarah — Ayat' heading found")
            return
        body = text[m.start():].rstrip()
        headings = [(int(a), int(b)) for a, b in ENTRY_HEADING.findall(body)]
        sources = SOURCE_ID.findall(body)
        if len(headings) != len(sources):
            errors.append(f"{name}: {len(headings)} entry headings vs {len(sources)} Source lines")
            return
        starts = [mtch.start() for mtch in ENTRY_HEADING.finditer(body)]
        for i, ((_, ayat_no), (tid_str, aid_str, para, _vol)) in enumerate(zip(headings, sources)):
            end = starts[i + 1] if i + 1 < len(starts) else len(body)
            entry_body = body[starts[i]:end].rstrip()
            paras.add(int(para))
            blocks.append((name, ayat_no, entry_body))

    for path in batch_files:
        collect(path.name, path.read_text(encoding="utf-8"))
    for path in insert_files:
        collect(f"_inserts/{path.name}", path.read_text(encoding="utf-8"))

    blocks.sort(key=lambda b: b[1])

    prev_ayat = 0
    for name, ayat_no, entry_body in blocks:
        tid_str, aid_str, _, _ = SOURCE_ID.search(entry_body).groups()
        tid, aid = int(tid_str), int(aid_str)
        if ayat_no <= prev_ayat:
            errors.append(f"{name}: duplicate/out-of-order ayat {ayat_no} (previous {prev_ayat})")
        prev_ayat = ayat_no
        pair = (tid, aid)
        if pair in seen_pairs:
            errors.append(f"{name}: duplicate entry tafseerId={tid} (also in {seen_pairs[pair]})")
        else:
            seen_pairs[pair] = name
        expected_tid = db_map.get(ayat_no)
        if expected_tid != tid:
            errors.append(f"{name}: ayat 2:{ayat_no} claims tafseerId={tid}, DB says {expected_tid}")
        expected_aid = db_ayat_ids.get(ayat_no)
        if expected_aid != aid:
            errors.append(f"{name}: ayat 2:{ayat_no} claims ayatId={aid}, DB says {expected_aid}")

    found_ayats = [b[1] for b in blocks]
    lo, hi = min(found_ayats), max(found_ayats)
    db_in_range = sorted(n for n in db_map if lo <= n <= hi)
    missing_ayats = sorted(set(db_in_range) - set(found_ayats))
    extra_ayats = sorted(set(found_ayats) - set(db_in_range))
    if missing_ayats:
        errors.append(f"DB has tafseer rows for ayats absent from batches/inserts: {missing_ayats}")
    if extra_ayats:
        errors.append(f"Batches cover ayats with no DB tafseer row: {extra_ayats}")

    print(f"Batches merged : {len(batch_files)} (+{len(insert_files)} inserts)")
    print(f"Entries        : {len(blocks)} (Ayat 2:{lo} – 2:{hi})")
    print(f"Paras          : {sorted(paras)}")
    print(f"Ayat gaps      : {sorted(set(range(lo, hi + 1)) - set(found_ayats)) or 'none'}")
    next_pending = min((n for n in db_map if n > hi), default=None)
    if next_pending:
        print(f"Next pending   : Ayat 2:{next_pending} (tafseerId {db_map[next_pending]})")
    else:
        print("Surah complete")

    if errors:
        print("\nConsolidation FAILED:")
        for e in errors:
            print(f"- {e}")
        sys.exit(1)

    def render_part(part_no, total_parts, part_blocks):
        part_lo, part_hi = part_blocks[0][1], part_blocks[-1][1]
        header = (
            "# Sirat-ul-Jinan fi Tafseer-il-Quran — Roman Urdu Transliteration\n\n"
            f"## Surah Al-Baqarah — Jild 1 (Part {part_no} of {total_parts})\n\n"
            f"> Surah Al-Baqarah — Para {', '.join(str(p) for p in sorted(paras))}, Jild 1.\n"
            "> This append-only surah manuscript is split into numbered parts of at most\n"
            f"> {MAX_FILE_LINES} lines. Entries remain in ayat order and are never split\n"
            "> between parts. Corrections target one entry via its unique `Source:` anchor line.\n>\n"
            f"> Part coverage: Ayat 2:{part_lo} – 2:{part_hi} ({len(part_blocks)} entries).\n"
            f"> Full coverage: Ayat 2:{lo} – 2:{hi} ({len(blocks)} entries).\n"
            f"> Next pending: Ayat 2:{next_pending} (tafseerId {db_map[next_pending]}).\n"
            "> Consolidated from transliteration batches (initial consolidation 2026-08-22);\n"
            "> verified against siratul-jinan.db (every ayat→tafseerId pair matched, none\n"
            "> missing or duplicated).\n>\n"
            "> Urdu script converted to Roman script; Quranic Arabic, Arabic duas, hadith\n"
            "> quotations, Islamic phrases, citations, and honorifics preserved in Arabic script\n"
            "> exactly as in the source.\n\n"
            "---\n\n"
        )
        return unicodedata.normalize(
            "NFC", header + "\n---\n\n".join(b[2] for b in part_blocks) + "\n"
        )

    parts = []
    current = []
    for block in blocks:
        candidate = current + [block]
        if len(render_part(1, 1, candidate).splitlines()) > MAX_FILE_LINES:
            if not current:
                sys.exit(
                    f"Entry Ayat 2:{block[1]} exceeds the {MAX_FILE_LINES}-line file limit"
                )
            parts.append(current)
            current = [block]
        else:
            current = candidate
    if current:
        parts.append(current)

    out_base = args.surah_dir / "02-surah-al-baqarah-roman"
    if not args.dry_run:
        old_path = args.surah_dir / "02-surah-al-baqarah-roman.md"
        if old_path.exists():
            old_path.unlink()
        for stale_path in args.surah_dir.glob("02-surah-al-baqarah-roman-*.md"):
            stale_path.unlink()
        for index, part_blocks in enumerate(parts, start=1):
            out_path = out_base.with_name(f"{out_base.name}-{index:02d}.md")
            rendered = render_part(index, len(parts), part_blocks)
            out_path.write_text(rendered, encoding="utf-8")
            print(f"Wrote          : {out_path} ({len(rendered)} chars; {len(rendered.splitlines())} lines)")
    else:
        print(f"Dry run only — {len(parts)} parts within {MAX_FILE_LINES} lines each")


if __name__ == "__main__":
    main()
