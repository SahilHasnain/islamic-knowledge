# Sirat-ul-Jinan Easy Roman Urdu Adaptation Plan

## Objective

Rewrite the Urdu tafseer of *Sirat-ul-Jinan fi Tafseer-il-Quran* into simple, readable
Roman Urdu for readers who find the original Urdu vocabulary or sentence structure hard.

This is an easy-language adaptation, not a script-only transliteration. Simplify difficult
words, idioms, and sentence structures while preserving the complete explanation, meaning,
sequence, evidence, citations, quotations, and devotional tone.

## Project Boundary

This project is independent from `publishing/siratul-jinan-roman-urdu/`, which remains a
literal Urdu-to-Roman transliteration. Do not overwrite or silently substitute the literal
transliteration with this adaptation.

## Source and Traceability

Use the shared database at:

`publishing/siratul-jinan-roman-urdu/source/siratul-jinan.db`

Each adapted entry must preserve its `tafseerId`, `ayatId`, surah, ayat number, para, and
volume in the working batch. The Urdu source remains the authority for meaning and content.

## Pilot

Begin with a small Al-Baqarah pilot before adapting a complete volume. The pilot must
establish approved handling for difficult vocabulary, long sentences, quotations, citations,
Arabic phrases, honorifics, headings, poetry, and numbered discussions.

## File Organization

```text
publishing/siratul-jinan-easy-roman-urdu/
  source/                         # Shared-source policy; database remains elsewhere
  notes/                          # Rules, glossary, decisions, and progress
  manuscript/
    00-pilot/
    01-jild-awwal/
      02-surah-al-baqarah/
  layout/
  exports/
  assets/
```

## File Size Rule

New or substantially changed files must contain at most 2,000 lines. Split only at logical
section or entry boundaries; never split a sentence, quotation, citation, numbered item,
or traceable adapted entry. Existing oversized files may remain unchanged unless they are
otherwise edited.
