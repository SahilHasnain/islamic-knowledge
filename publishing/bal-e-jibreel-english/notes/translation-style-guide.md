# Bal-e-Jibreel: Poetic English Translation

## Purpose

This project presents a poetic English translation of Bal-e-Jibreel. It is a complete translation of the kalams in `content/books/bal-e-jibreel.json`, not a commentary, paraphrase, or prose adaptation.

## Source and traceability

- The sole source is `content/books/bal-e-jibreel.json`.
- The Urdu field is the semantic source. The transliteration field is used to verify stanza boundaries, line order, repeated phrases, and line-level traceability.
- Every kalam records its JSON order, slug, title, source URL, stanza count, and line count.
- Each source stanza remains a separate stanza, and each source line remains one translated line.
- No source material outside the requested five kalams is translated.

## Session and batch workflow

- One user session covers up to 20 consecutive kalams.
- Process the session in four sequential batches of five kalams: 001-005, 006-010, 011-015, and 016-020, then continue the same five-kalam pattern for later ranges.
- Complete and verify each batch before starting the next. Do not stop between batches unless a genuine blocker requires clarification.
- Extract the complete JSON records for the current five kalams before translating. Translate from that complete extraction, never from terminal previews, shortened output, summaries, or guessed URLs.
- Append only complete kalam boundaries. Never split a kalam, stanza, quotation, or source entry to meet the file limit.
- A subagent must report the exact JSON indices, slugs, URLs, nonblank source-line counts, stanza counts, and manuscript line counts. A batch is not complete until these are independently checked against the source.
- If a subagent finds a source-order mismatch, displaced kalam, omitted line, duplicate line, or incorrect count, it must repair the batch before reporting completion.
- After every batch, verify the previous batches remain unchanged, then update the batch register and translation plan.

## Poetic method

- Write living poetic English rather than word-for-word English or prose explanation.
- Preserve the source's imagery, emotional force, philosophical direction, questions, repetitions, contrasts, and movement of address.
- Let rhythm, stress, and natural English syntax guide the line, but do not merge, split, reorder, or omit lines.
- Preserve ambiguity where the Urdu deliberately leaves a question open. Do not resolve a philosophical question through explanatory wording.
- Keep metaphors such as wine, cup, Saqi, shell, pearl, garden, hunter, sky, and resurrection vivid rather than reducing them to abstract concepts.
- Use punctuation to carry the source's interrogation, lament, command, and exclamation without adding commentary.

## Sacred language and adab

- Preserve Quranic Arabic, Arabic duas, established Islamic terms, Arabic quotations, and `ﷺ` exactly where they occur or are required by the source and context.
- For the final Prophet Muhammad ﷺ, use only the Arabic superscript honorific `ﷺ`; never use
  `S.A.W.`, `S.A.W`, or another Latin short form. Omit honorifics belonging to other people in
  the English poem.
- Address Allah reverently. Capitalize direct pronouns such as `You` and `Your` when they address Allah.
- Do not use diminishing, irreverent, or incapacitating wording for the Prophet ﷺ.
- Keep names such as Kaaba, Somnath, Gabriel, Quran, Paradise, and Judgment Day accurate and recognizable.

## Manuscript hygiene

- Metadata and source URLs appear outside the poem.
- Do not place explanations, translator notes, glosses, HTML, or transliteration inside a poem.
- Use Markdown headings and metadata only; poem text itself is plain English.
- Keep every new file below 1,000 lines.

## Subagent quality gate

- Before editing, identify the exact five JSON records by zero-based source position and print their slugs, URLs, and source counts from the complete records.
- Before reporting completion, compare every translated stanza and line with both `urdu` and `transliteration`; do not infer completeness from headings or total file length.
- Verify that each manuscript heading, title, URL, stanza count, and line count belongs to the same JSON record. Never copy metadata from another kalam.
- Verify that no kalam outside the assigned five was added, that no assigned kalam was omitted, and that no earlier manuscript content changed.
- Run a script-based check for order, source URLs, nonblank line counts, prohibited honorifics, Urdu/Devanagari leakage, HTML, and `git diff --check`.
- If any check fails, report the failure and continue correcting it; do not mark the batch complete.
