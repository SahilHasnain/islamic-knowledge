# Editorial Decisions — Tawakkul (Roman Urdu)

## Translation Approach

Roman Urdu translation is prepared via the manual batch translation workflow, with the manuscript files under `manuscript/` as the source of truth for publishing.

## Arabic Preservation

Qur’ānic verses are kept in Arabic script as printed in the source, correcting the garbled PDF extraction where recognisable. English-script transliteration lines are removed, keeping only the Arabic script followed by the Roman Urdu meaning.

## Salawat Glyph

The PDF text layer renders the salawat as a standalone `k`. All such occurrences are converted to ﷺ in the manuscript.

## Export Pipeline

The book exports HTML, digital PDF, print PDF, EPUB, and DOCX via `scripts/export_tawakkul_roman_urdu.mjs`, following the same A5 pipeline used for the other publishing projects. Generated files live only under `exports/`.

## Partial Publication

Do not publish a public book route for this title until the manuscript has been reviewed enough for public release.