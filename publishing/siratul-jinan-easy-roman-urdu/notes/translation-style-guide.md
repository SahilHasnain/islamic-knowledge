# Easy Roman Urdu Style Guide

## Adaptation Method

- Preserve the full source content and order.
- Replace difficult Urdu vocabulary with familiar Roman Urdu where the meaning remains
  exact.
- Break very long sentences into shorter sentences when this improves readability.
- Explain an uncommon expression in simple Roman Urdu only when the source itself explains
  it; do not add independent commentary.
- Do not summarize, omit, merge away, or invent source material.

## Quran Translation

- Use the broader QuranDB `translation` table with `trans_type=2`, named Kanz-ul-Irfan
  (Sirat), for the Quran translation attached to each ayat.
- Transliterate this Urdu translation into Roman Urdu; do not translate, paraphrase, simplify,
  or replace its wording.
- Keep the translation separate from the Easy Roman Urdu tafseer adaptation.
- Preserve the translation's ayat mapping and include its source text in the extracted batch
  for traceability.

## Arabic and Islamic Content

- Preserve Quranic Arabic exactly as supplied by the database.
- Preserve Arabic duas, hadith quotations, established Islamic phrases, and Arabic
  honorifics in Arabic script unless an approved project decision says otherwise.
- Arabic-derived terms that are being explained in ordinary prose may be written in simple
  Roman Urdu when that improves accessibility. For example, `حروفِ مُقَطَّعَات` becomes
  `Huroof-e-Muqatta'aat`; Quranic verse text and Arabic quotations remain Arabic.
- Preserve `ﷺ` wherever it occurs.
- Keep citations and source references complete.
- Follow the project's adab rules for references to the Prophet ﷺ.

## Roman Urdu

- Use simple, natural Roman Urdu rather than word-for-word difficult phrasing.
- Prefer natural word order in easy Roman Urdu. For example, use `kaam ke tareeqe`
  instead of the harder compound `tareeqa-e-kaam`.
- Keep established spellings from the project glossary.
- Use `mana` instead of the difficult word `manaahi` in easy explanatory prose.
- Preserve Urdu meaning, not Urdu grammatical awkwardness caused by extraction artifacts.
- Keep headings, numbered discussions, poetry, and quotations structurally recognizable.
- Never alter shair or poetry from the source. Preserve its exact wording, line breaks,
  punctuation, and order; do not simplify, paraphrase, transliterate differently, or add
  explanatory text inside the shair.

## Review

Every batch must be checked for semantic completeness, source coverage, Arabic preservation,
citation fidelity, honorific fidelity, and accidental Urdu or HTML leftovers.

## Manuscript Continuity

- Always continue appending complete entries to the current manuscript file.
- Do not create or switch to a new manuscript file merely because a batch, session, or ayat range is complete.
- Keep using the current file until it reaches the 1,000-line limit, or until adding the next complete entry would exceed 1,000 lines.
- Only then create the next sequential manuscript file.
- Never split an entry, paragraph, quotation, citation, numbered item, or other logical unit across files.

## Session Batches

- Target ten aayaat per translation session.
- Process each ten-ayat session as two sequential batches of five aayaat.
- Complete and verify the first five-ayat batch before starting the second five-ayat batch.
- This batching workflow does not override manuscript continuity or the 1,000-line rule.
