# Bahar-e-Shariat Easy Roman Urdu Style Guide

## Method

- Adapt the complete Urdu source into clear, natural Easy Roman Urdu.
- Preserve every belief, ruling, explanation, example, citation, and reference.
- If the source wording is already simple and clear, retain it closely. Do not make it more casual, paraphrase it, or modernise it without a real readability need.
- Do not summarize or merge separate source pages.
- Keep one reader-facing manuscript entry for each SQLite source page.
- Continue adding page entries to the same readable manuscript file until it approaches 1,000 lines. Do not start a new file merely because a batch or session is complete. Start the next sequential file only when the current file is close to 1,000 lines and adding the next complete page would exceed the limit; split only at a clean section or page boundary.
- A session may cover up to 30 source pages, but must be divided into three 10-page batches. Verify each batch for complete source coverage before proceeding.
- Never translate from shortened previews or summaries. Read the complete source JSON records. Preserve every paragraph, quotation, citation, footnote, example, and named detail, then perform an internal source-content check before continuing. User manual verification is optional and tracked separately.
- Translate the complete source faithfully. Do not summarize, shorten, omit, combine, or change the meaning. Preserve the author's sequence, emphasis, claims, quoted passages, explanations, examples, citations, and footnotes. Simplify wording only for readability, never the content.
- Preserve the source's certainty and strength. Do not weaken definite statements with `can`, `may`, `might`, `could`, or other uncertain wording unless possibility or permission is present in the source.

## Section 2: Fiqh and Taharat

- Section 2 is for Easy Roman Urdu readers, not a literal word-for-word Romanization of formal Urdu. Use short, clear sentences and familiar wording while preserving every ruling, condition, exception, example, quotation, citation, and footnote.
- Explain a technical fiqh term in simple words at its first use. After that, retain the approved term only when it improves accuracy. Do not leave a chain of unfamiliar Arabic and Persian terms unexplained.
- Break long source sentences into several short sentences. Do not join separate source rulings or remove their logical conditions.
- Keep classifications visibly separate, such as Farz, Wajib, Sunnat, Mustahab, Mubah, Haram, and Makrooh. State each definition and its practical consequence clearly.
- Preserve the force of every legal statement. Do not turn `farz`, `wajib`, `jaiz`, `na-jaiz`, `haram`, `zaruri`, or a definite prohibition into weaker wording such as `should`, `may`, `can`, or `perhaps`.
- Keep hadith quotations as quotations. The surrounding explanation may be simplified, but the quoted meaning, sequence, named narrators, references, and stated rewards or warnings must remain complete.
- Translate citations and footnotes into readable Roman Urdu where they contain explanatory content; do not replace them with a bare list of book names and hadith numbers.

## Script

- Romanize ordinary Urdu prose, Arabic vocabulary, names, scholarly titles, and book titles when pronunciation is clear.
- Prefer familiar Easy Roman Urdu. Do not introduce a difficult Arabic or Persian term merely by romanizing it; replace it with a clear meaning or add the meaning in brackets when the original term should be retained.
- Preserve Quranic verses and complete hadith quotations in Arabic when their exact wording is important.
- Preserve quotation boundaries from the source. Use quotation marks around quoted beliefs, statements, book passages, hadith, and cited material so readers can distinguish the author's narration from quoted words.
- Write in the author's narrative voice. Do not add translator-facing phrases such as `source ki wazahat ke mutabiq`, `the source says`, or `in this translation` unless they are present in the source.
- Quranic translations from the source must be preserved word-for-word in Roman script. Do not translate, paraphrase, simplify, reorder, omit, or replace source words. Only change script, spacing, and punctuation as needed for Roman Urdu readability; verify every Quranic translation against the Urdu source before approval.
- Preserve Arabic honorifics such as `رضی الله تعالی عنہ` and `ﷺ`.
- Preserve aqeedah adab: never phrase an explanation as a direct negation of Allah’s perfect Sifaat. For Muhaal, explain that it is not a subject of Qudrat because it cannot exist by its own nature; affirm Allah’s complete Qudrat over every mumkin.
- Keep the extracted source JSON as the exact Urdu and Arabic reference.

## SQLite Compatibility

- Every entry must retain `jild`, `section`, `page_number`, `source_table`, and source heading metadata.
- Do not use information only in Markdown formatting to convey source identity.
- Keep citations and paragraph text inside the entry text field.
- Avoid HTML, footnote syntax, and decorative markup that the compiler cannot parse reliably.

## Review

Validate page coverage, ordering, metadata, Arabic preservation, honorifics, citations, accidental Urdu prose, and accidental HTML.
