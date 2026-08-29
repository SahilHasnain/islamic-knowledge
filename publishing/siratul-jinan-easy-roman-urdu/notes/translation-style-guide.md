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

## Review

Every batch must be checked for semantic completeness, source coverage, Arabic preservation,
citation fidelity, honorific fidelity, and accidental Urdu or HTML leftovers.
