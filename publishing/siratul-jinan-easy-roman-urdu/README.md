# Sirat-ul-Jinan — Easy Roman Urdu

This is a separate project from `publishing/siratul-jinan-roman-urdu/`.

## Purpose

Convert the difficult Urdu tafseer of *Sirat-ul-Jinan fi Tafseer-il-Quran* into clear,
accessible Roman Urdu while preserving the complete meaning, explanations, references,
and devotional tone.

This project is an **easy-language adaptation**, not literal transliteration. Vocabulary,
sentence structure, and difficult expressions may be simplified for readability, but no
source explanation may be summarized, omitted, or replaced with unrelated commentary.

## Source

The authoritative source remains the existing SQLite database:

`../siratul-jinan-roman-urdu/source/siratul-jinan.db`

The database is referenced, not duplicated. Every adapted entry must remain traceable to
its `tafseerId`, `ayatId`, surah, ayat number, para, and volume.

## Workflow

1. Read the project rules in `notes/` before adapting a batch.
2. Extract source text and identifiers from the shared SQLite database.
3. Rewrite difficult Urdu into simple Roman Urdu without losing content or meaning.
4. Preserve Quranic Arabic, Arabic duas, Islamic phrases, honorifics, citations, and
   quotations according to the project rules.
5. Review semantic completeness against the Urdu source.
6. Keep every new or substantially changed file at no more than 2,000 lines.

The project begins with a small pilot. Full-volume adaptation should not begin until the
pilot's style and review conventions are approved.
