# Easy Roman Urdu Editorial Decisions

## Project Distinction

The literal Roman Urdu project changes Urdu script into Roman script while preserving Urdu
vocabulary and sentence structure. This project may simplify difficult language, but it must
preserve the source's complete meaning, explanations, evidence, citations, and tone.

## Source Authority

The shared SQLite database is authoritative for source text, identifiers, Quranic mapping,
and ordering. The Urdu text is authoritative for the meaning of every adaptation.

## Quran Translation Source

The Quran translation is sourced from the broader QuranDB database rather than the focused
Sirat-ul-Jinan database. Use `translation.trans_type=2`, Kanz-ul-Irfan (Sirat). The translation
must be transliterated from Urdu script into Roman Urdu, not translated or rewritten. The
extraction script supports this with `--include-translation`.

## Arabic and Adab

Arabic Quranic text, Arabic duas, Islamic phrases, quotations, and honorifics are preserved
according to the project style guide and the repository's adab rules. Any exception must be
recorded here before use.

## Open Decisions

- Final approved simplicity level and audience description
- Whether selected difficult Arabic-derived terms may receive parenthetical Roman Urdu glosses
- Pilot review and approval process
- Export format and reader-facing heading style

## Pilot Sample

The first pilot is a focused excerpt from Al-Baqarah 2:1 (`tafseerId=50147`, `ayatId=10`).
It is intentionally marked partial and must not be treated as complete source coverage.
The sample tests shorter sentences, simpler vocabulary, Arabic preservation, honorifics,
citations, and clear headings before full-entry adaptation begins.

The term `حروفِ مُقَطَّعَات` is approved as `Huroof-e-Muqatta'aat` in easy Roman Urdu
prose. This does not authorize Romanizing Quranic verse text, Arabic quotations, duas, or
honorifics.

The second pilot sample uses Ayat 2:3 to test numbered explanations, simple definitions,
and selected Quranic quotations. It remains a style sample rather than a complete adapted
entry.

Natural phrasing takes priority over difficult Urdu compounds in the Easy adaptation. For
example, `tareeqa-e-kaam` was changed to `kaam ke tareeqe`.

For natural, consistent Roman Urdu, use `unhone` and `inhone` project-wide instead of
`unhon ne` and `inhon ne`.

Use `mana` project-wide instead of the difficult word `manaahi` in easy explanatory prose.

Use `shehad jaisi ek meethi cheez` instead of `taranjabeen` in easy explanatory prose.
Use `Amaaliqah (ek puraani taaqatwar qaum)` instead of unexplained `Amaaliqah` in easy explanatory prose.
Use `maa ki ijaazat ka intezaar mat karo` instead of `maa ki ijaazat par mauqoof na rakho`.
Use `khush-mizaaji` instead of `khush-tab'i` in easy explanatory prose.
Use continuous `InshaAllah` instead of `In sha Allah` in easy Roman Urdu prose.

Manuscript files remain active across batches and sessions. Always append to the current file;
create the next sequential file only when the current file reaches 1,000 lines or the next
complete entry would exceed 1,000 lines. Do not switch files merely because a batch is complete.

Each session targets ten aayaat in two sequential five-ayat batches. Verify the first batch
before beginning the second; this does not permit switching manuscript files early.

Poetry and shair must never be altered. Preserve the source wording, line breaks, punctuation,
and order exactly, without simplification, paraphrase, or inserted explanation.

The first production entry is Al-Baqarah 2:1. It is marked `draft` until semantic
completeness and editorial style review are finished.

The second production entry is Al-Baqarah 2:3. Ayat 2:2 is not fabricated or filled by
adaptation because the authoritative database has no tafseer row for it.
