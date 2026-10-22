# Zarb-e-Kaleem: Poetic English Translation

## Purpose

This project is a complete poetic English translation of `content/books/zarb-e-kaleem.json`, not a summary, commentary, explanation, or prose adaptation.

## Source and traceability

- The Urdu field is the semantic source.
- The transliteration field is used for line order, stanza boundaries, repeated phrases, and traceability.
- Preserve every nonblank source line as exactly one English line, in JSON order.
- Preserve every source stanza boundary exactly. Never merge, split, reorder, or omit a stanza or line.
- Keep each kalam's exact JSON slug and source URL. Record the exact source title in metadata.

## Poetic method

- Write poetic English with natural rhythm and force, not word-for-word stiffness.
- Preserve imagery, questions, repetitions, contrasts, emotional movement, and philosophical direction.
- Keep deliberate ambiguity and rhetorical questions open; do not turn poetry into commentary.
- Do not add translator commentary, explanations, glosses, footnotes, or HTML inside the poem.

## Sacred language and adab

- Preserve `ﷺ` only for Muhammad ﷺ when it is present or required by context.
- Omit non-Prophet honorifics and all Latin honorifics.
- Use `Loulak`, never `La-Law-Laka`.
- Where an abbreviated Shahadah expression is used, complete it as “there is no god but Allah” rather than leaving a misleading standalone denial.
- Do not use Urdu or Devanagari in the English poem. Preserve only explicitly required Arabic script; none is required in this batch.

## Manuscript hygiene

- Metadata stays outside the poem.
- Use Markdown headings and metadata; poem text is plain English.
- Keep every new file below 1,000 lines.
- Use exact JSON order and append only complete kalam entries.

## Quality gate

- Compare every English line and stanza against both Urdu and transliteration.
- Verify exact metadata, order, URLs, counts, no omissions, duplicates, or displaced entries.
- Check for Urdu/Devanagari leakage, HTML, Latin honorifics, prohibited `La-Law-Laka`, and incomplete Shahadah renderings.
- Run `git diff --check` before reporting completion. Repair every failed check first.
