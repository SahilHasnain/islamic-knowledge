# Fatawa Razaviya Easy Roman Urdu Style Guide

## Adaptation Method

- Rewrite the complete Urdu source in simple, natural Roman Urdu.
- Preserve every ruling, explanation, example, quotation, reference, and section boundary.
- Do not summarize, omit, or add independent commentary.
- Break long Urdu sentences into shorter sentences when the meaning remains exact.

## Source and Traceability

- The source of truth is `db/fatawa_e_razvia.db`.
- The database's `hadith.without_araab` field contains the Urdu Fatawa content despite the table name.
- Every entry must record volume, lesson, chapter or sub-chapter when present, database row order, and source references.

## Arabic, Quran, Hadith, and Adab

- Preserve exact Arabic for Quranic verses, complete hadith quotations, duas, and other wording whose Arabic form is itself important.
- Romanize Arabic and Persian vocabulary when it is part of ordinary Urdu prose and the pronunciation is clear.
- Romanize names, scholarly titles, sanad chains, footnotes, and book titles in the reader-facing manuscript unless exact Arabic wording is necessary.
- Preserve `ﷺ` and Arabic honorific phrases such as `رضی الله تعالی عنہ` exactly. Other ordinary
  honorific wording may be romanized when this improves reading flow.
- The extracted source JSON remains the exact-script reference. The manuscript does not need to reproduce every Arabic or Urdu line.
- Follow the repository-wide adab rules for references to the Prophet ﷺ, Ambiya, Sahaba, Ahl-e-Bait, and scholars.

## Easy Roman Urdu

- Prefer familiar words and natural sentence order.
- Use `unhone` and `inhone`, not `unhon ne` or `inhon ne`.
- Use `mana` instead of `manaahi`.
- Use `Ambiya`, not `Anbiya`.
- Avoid difficult words such as `tehband`, `mahetat`, `mufeed`, `naadim`, and `miyaanah-rawi`; record replacements in the glossary before reuse.

## Review

Check every batch for completeness, source ordering, citation fidelity, Arabic preservation, honorifics, accidental Urdu prose, and consistent terminology.
