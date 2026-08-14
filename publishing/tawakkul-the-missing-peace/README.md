# Tawakkul – The Missing Peace in the Journey of Life (Roman Urdu)

This directory is for the Roman Urdu translation of Shaykh Faheem's English book `Tawakkul – The Missing Peace in the Journey of Life`.

- Source: `source/tawakkul-extracted.json` (raw PDF extraction, 160 pages).
- Target language: Roman Urdu.
- Workflow: manual batch translation, in short batches, following the same approach used for `Shifa Shareef` English.

## Workflow

1. Translate in short, self-contained batches. Batches do not necessarily each get their own file — continue within the relevant `manuscript/` file.
2. Keep translation decisions in `notes/translation-style-guide.md`.
3. Add recurring terms to `notes/glossary.md`.
4. Record larger editorial decisions in `notes/editorial-decisions.md`.
5. Export generated files only under `exports/`.
6. Layout lives in `layout/` (`title-page.md`, `book.css`).
7. Export with `node scripts/export_tawakkul_roman_urdu.mjs`.

## Important Rules

- Preserve Arabic script from the source exactly as-is; do NOT romanize Arabic/Quranic phrases.
- Quranic verses are kept in Arabic script (garbled extraction to be corrected during translation).
- Preserve adab for the Prophet ﷺ (never "died"/"death of the Prophet"; use "departed (from this world)", "passed away", "was called back").
- The extracted salawat glyph `k` (rendered as a standalone letter in the PDF) is converted to ﷺ.
