# Editorial Decisions

Record larger editorial decisions here as the manuscript develops.

## Initial Decision

- **Source**: `content/books/shifa-shareef.json` — the Roman Urdu edition (transliteration of Sadr al-Afazil's Urdu translation). The Hindi manuscript is a script conversion (Roman -> Devanagari) of this source, not a translation of the English `Shifa Shareef` manuscript.
- **Method**: Manual batch transliteration. No automated transliteration script.
- **Honorifics**: Standardized to Arabic superscripts (see `transliteration-style-guide.md`).

## Batch architecture (2026-08-22)

- Pilot batches were initially split per-fasl (~13 small files); consolidated into **one Markdown file per baab**.
- Rationale: per-fasl files averaged ~4 KB, causing excessive file switching during review; baab-level files keep review/export simple while each fasl remains an H1 section inside the file.
- Layout: `00-pilot/01-frontmatter.md`, `02-muqaddima.md`, `03-qism1-pehla-baab.md`; future files `04-qism1-dusra-baab.md`, `05-qism1-teesra-baab.md`, …
- Fasls transliterated before the restructure were merged verbatim — no text was edited during consolidation (verified by byte-level comparison plus separator accounting).
