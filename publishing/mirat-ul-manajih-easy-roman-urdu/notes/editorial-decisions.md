# Editorial Decisions

- Source fields are `hadith_content.c9with_araab`, `c12translation`, and `c13explanation`.
- Source selection is `book_id=1`, `volume_id=1`, hadith numbers 1 through 10, ordered with `CAST(c7hadith_no AS INTEGER)`.
- `c9with_araab` is reproduced verbatim in each entry. Database export markers are not part of the Arabic and are excluded.
- Urdu footnote markers are retained as numbered explanation headings. Broken export punctuation is cleaned without changing the statement.
- Numbered markers embedded in `c12translation` are part of the literal translation and must be preserved at the corresponding Roman Urdu location as `**1**`, `**2**`, etc.; markers must never be omitted or renumbered. This correction applies explicitly to Hadith 91-100 and future batches.
- `رَوَاهُ مُسْلِمٌ`, `(مُتَّفَقٌ عَلَيْهِ)`, and similar Arabic citations remain Arabic.
- The source uses varied spellings of honorifics; the Roman Urdu adaptation consistently preserves respectful honorifics and `ﷺ`.
- No manuscript file is split within a hadith entry.
- Work is performed in the primary session without subagents.
- Each `next` or `continue` session processes 10 hadith as two verified sub-batches of 5. Complete source records are first extracted into Markdown and used as the translation source.
