# Fatawa Razaviya Easy Roman Urdu Adaptation Plan

## Objective

Rewrite Fatawa Razaviya into clear, easy Roman Urdu while preserving every ruling, proof,
example, quotation, citation, devotional expression, and original section boundary.

## Source

`db/fatawa_e_razvia.db`

The database contains 1 book, 31 volumes, 451 lessons, 21 chapters, and 19,709 main content
records. The main Urdu text is in `hadith.without_araab`; the table name is inherited from the
source application's data model. The database passes SQLite integrity checking.

## Workflow

1. Extract a complete lesson or a semantically complete section with volume, lesson, chapter,
   sub-chapter, SQLite row order, and references.
2. Preserve Arabic quotations and citations exactly.
3. Adapt the Urdu prose into easy Roman Urdu without summarizing or changing rulings.
4. Review difficult vocabulary and record approved replacements in the glossary.
5. Validate source coverage, ordering, Arabic preservation, citations, honorifics, and accidental
   Urdu or HTML leftovers.
6. Keep each manuscript file below 1,000 lines and split only at complete section boundaries.

## Pilot

Start with `Jild-1-Part-1`, lesson `472`, the 5-record Sanad section. Do not process the full
volume until the pilot style and source-traceability conventions are reviewed.
