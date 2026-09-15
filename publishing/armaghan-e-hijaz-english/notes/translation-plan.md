# Armaghan-e-Hijaz English Translation Plan

## Source

- Source of truth: `content/books/armaghan-e-hijaz.json`
- Total source kalams: 43
- Translation order: JSON order, beginning at index 0.
- This approved opening batch covers indices 0-4, kalams 001-005.

## Batch Method

1. Read complete JSON records before translating.
2. Translate the Urdu semantic source while checking the transliteration for traceability.
3. Preserve stanza boundaries and all labels, turns, repetitions, questions, images, and movements.
4. Append only complete kalams to the current manuscript until the next complete kalam would exceed 1,000 lines.
5. Verify source metadata, line counts, structure, order, coverage, script hygiene, and `git diff --check`.

## Batch 01

- Scope: JSON indices 0-4, kalams 001-005.
- Destination: `manuscript/01-armaghan-e-hijaz-english-01.md`.
- All five entries fit in one manuscript file without splitting a kalam or stanza.
- Kalam 001 is a dramatic dialogue and must retain every named speaker and numbered section.
- Batch 01 verification: 230 Urdu source lines, 228 transliteration lines, 207 English poetic lines, 23 structural lines, 18/11/12/18/3 stanza blocks, and 390 manuscript lines.
