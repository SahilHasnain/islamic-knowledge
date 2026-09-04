# Editorial Decisions

- Source fields are `hadith_content.c9with_araab`, `c12translation`, and `c13explanation`.
- Source selection is `book_id=1`, `volume_id=1`, hadith numbers 1 through 10, ordered with `CAST(c7hadith_no AS INTEGER)`.
- `c9with_araab` is reproduced verbatim in each entry. Database export markers are not part of the Arabic and are excluded.
- Urdu footnote markers are retained as numbered explanation headings. Broken export punctuation is cleaned without changing the statement.
- `رَوَاهُ مُسْلِمٌ`, `(مُتَّفَقٌ عَلَيْهِ)`, and similar Arabic citations remain Arabic.
- The source uses varied spellings of honorifics; the Roman Urdu adaptation consistently preserves respectful honorifics and `ﷺ`.
- No manuscript file is split within a hadith entry.
