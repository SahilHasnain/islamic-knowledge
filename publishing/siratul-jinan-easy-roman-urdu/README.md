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

The broader QuranDB source also contains the selected `Kanz-ul-Irfan (Sirat)` Quran
translation (`trans_type=2`). Extract it with each batch and transliterate it from Urdu
script into Roman Urdu. This is transliteration, not translation or paraphrasing.

## Workflow

1. Read the project rules in `notes/` before adapting a batch.
2. Extract source text, identifiers, and the `trans_type=2` Kanz-ul-Irfan translation.
3. Transliterate the Quran translation into Roman Urdu without changing its wording or meaning.
4. Rewrite difficult tafseer Urdu into simple Roman Urdu without losing content or meaning.
5. Preserve Quranic Arabic, Arabic duas, Islamic phrases, honorifics, citations, and
   quotations according to the project rules.
6. Review translation coverage and transliteration fidelity, then check tafseer semantic
   completeness against the Urdu source.
7. Keep every new or substantially changed file at no more than 1,000 lines.

The project begins with a small pilot. Full-volume adaptation should not begin until the
pilot's style and review conventions are approved.
