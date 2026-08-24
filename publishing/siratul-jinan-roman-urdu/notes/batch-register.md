# Sirat-ul-Jinan Transliteration Batch Register

Per-batch files for Al-Baqarah have been superseded by the single-surah manuscript
convention (2026-08-22). Originals preserved under `_archive/batches-01-82/` and
`_archive/batches-83-85/`, `_archive/batches-86/`, and `_archive/batches-87-91/`.

| File | Volume | Para | Surah / ayat range | Source entries | Status | Review notes |
|---|---:|---:|---|---:|---|---|
| `00-pilot/01-surah-al-fatihah.md` | 1 | 1 | Al-Fatihah 1:0–1:6 | 7 | extracted | Source batch; superseded by the roman batch |
| `00-pilot/01-surah-al-fatihah-roman.md` | 1 | 1 | Al-Fatihah 1:0–1:6 | 7 | approved | Passes `validate_siratul_jinan_translation.py --mode transliteration`; editorial review complete — approved for scaling |
| `01-jild-awwal/02-surah-al-baqarah/02-surah-al-baqarah-roman-01.md` + `-02.md` | 1 | 1 | Al-Baqarah 2:1–2:126 | 125 | approved | Consolidated from batches 01–91 plus `_inserts/` cross-references (2:36, 2:39, 2:46); each part is at most 2,000 lines; both parts pass validator; every ayat→tafseerId pair matched against DB via `consolidate_siratul_jinan_batches.py`; coverage complete (ayat 2 has no source row) |
