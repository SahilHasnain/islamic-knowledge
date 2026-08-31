# Bahar-e-Shariat Easy Roman Urdu Translation Plan

1. Extract each volume page with its volume, section, page number, heading, and source table.
2. Create page-preserving source JSON batches.
3. Adapt each page into Easy Roman Urdu without omitting content.
   Keep already-clear source wording close to the original; simplify only genuine difficult wording.
4. Preserve exact Quranic and hadith wording where necessary, plus Arabic honorifics.
5. Validate source coverage, page order, metadata, citations, Arabic, and script cleanliness.
6. Review and approve pilot pages before scaling to the complete volume.
7. Compile approved page entries into SQLite using `page_number` and section metadata.

## Session Batch Size

One session runs from the user's prompt through completion. Do not stop between
batches after reporting progress. Target up to 30 source pages per session when
practical, divided into three sequential batches of 10 pages. Complete and
verify each 10-page batch before starting the next, and stop only when the full
session work is complete or a genuine blocker requires clarification. This target does not override the manuscript file rule: keep
appending complete pages to the current file, and start the next file only when
adding the next complete page would exceed 1,000 lines.

## Batch Verification

Never translate from SQLite previews, shortened output, or summaries. Read the
complete source JSON for each 10-page batch. Preserve every paragraph, quotation,
citation, footnote, example, and named detail. Perform an internal source-content
check before starting the next batch; the user's later manual checking is
optional and is tracked separately in `notes/manual-verification-log.md`.

The translation must be complete, not a summary. Do not shorten, omit, combine,
or change the source's meaning, sequence, emphasis, claims, quoted passages,
explanations, examples, citations, or footnotes. Use Easy Roman Urdu only to make
the wording clearer.
Preserve the source's certainty and strength; do not turn definite statements
into weaker `can`, `may`, `might`, or `could` statements unless the source does so.

## Manuscript File Rule

Keep appending pages to the current manuscript file across batches and sessions.
Only start the next file when the current file is close to 1,000 lines and the
next complete page would exceed that limit. A completed batch is not a reason to
create a new file.

## Pilot

Start with Volume 1, Section 1, pages 4–6, under the table-of-contents heading
`Aqaid Mutaliq Zaat-o-Sifaat-e-Ilahi`.
