# Sirat-ul-Jinan Transliteration Batch Register

Per-batch files for Al-Baqarah have been superseded by the single-surah manuscript
convention (2026-08-22). Originals preserved under `_archive/batches-01-82/`.

| File | Volume | Para | Surah / ayat range | Source entries | Status | Review notes |
|---|---:|---:|---|---:|---|---|
| `00-pilot/01-surah-al-fatihah.md` | 1 | 1 | Al-Fatihah 1:0–1:6 | 7 | extracted | Source batch; superseded by the roman batch |
| `00-pilot/01-surah-al-fatihah-roman.md` | 1 | 1 | Al-Fatihah 1:0–1:6 | 7 | approved | Passes `validate_siratul_jinan_translation.py --mode transliteration`; editorial review complete — approved for scaling |
| `01-jild-awwal/02-surah-al-baqarah/02-surah-al-baqarah-roman.md` | 1 | 1 | Al-Baqarah 2:1–2:113 | 112 | approved | Consolidated from batches 01–82 plus `_inserts/` cross-references (2:36, 2:39, 2:46); passes validator; every ayat→tafseerId pair matched against DB via `consolidate_siratul_jinan_batches.py`; coverage complete (ayat 2 has no source row) |
