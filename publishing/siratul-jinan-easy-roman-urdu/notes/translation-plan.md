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
Each batch must also extract the corresponding Quran translation from the broader QuranDB
source using `translation.trans_type=2` (Kanz-ul-Irfan, Sirat). That translation is to be
transliterated into Roman Urdu, not translated or paraphrased.

## Pilot

Begin with a small Al-Baqarah pilot before adapting a complete volume. The first focused
style sample uses a partial excerpt from Ayat 2:1 and is not counted as complete coverage.
The pilot must establish approved handling for difficult vocabulary, long sentences,
quotations, citations, Arabic phrases, honorifics, headings, poetry, and numbered discussions.

## Current Progress

The easy-language style has been approved. The first production manuscript file contains
complete adaptations of Al-Baqarah 2:1 (`tafseerId=50147`, `ayatId=10`), 2:3
(`tafseerId=50149`, `ayatId=12`), 2:4 (`tafseerId=50150`, `ayatId=13`), 2:5
(`tafseerId=50151`, `ayatId=14`), 2:6 (`tafseerId=50152`, `ayatId=15`), 2:7
(`tafseerId=50153`, `ayatId=16`), 2:8 (`tafseerId=50154`, `ayatId=17`), 2:9
(`tafseerId=50155`, `ayatId=18`), 2:10 (`tafseerId=50156`, `ayatId=19`), 2:11
(`tafseerId=50157`, `ayatId=20`), 2:12 (`tafseerId=54504`, `ayatId=21`), 2:13
(`tafseerId=50158`, `ayatId=22`), 2:14 (`tafseerId=50159`, `ayatId=23`), 2:15
(`tafseerId=50160`, `ayatId=24`), 2:16 (`tafseerId=50161`, `ayatId=25`), 2:17
(`tafseerId=50162`, `ayatId=26`), 2:18 (`tafseerId=54505`, `ayatId=27`), 2:19
(`tafseerId=50163`, `ayatId=28`), 2:20 (`tafseerId=54506`, `ayatId=29`), 2:21
(`tafseerId=50164`, `ayatId=30`), 2:22 (`tafseerId=50165`, `ayatId=31`), 2:23
(`tafseerId=50166`, `ayatId=32`), 2:24 (`tafseerId=50167`, `ayatId=33`), 2:25
(`tafseerId=50168`, `ayatId=34`), 2:26 (`tafseerId=50169`, `ayatId=35`), 2:27
(`tafseerId=50170`, `ayatId=36`), 2:28 (`tafseerId=50171`, `ayatId=37`), 2:29
(`tafseerId=50172`, `ayatId=38`), 2:30 (`tafseerId=50173`, `ayatId=39`), 2:31
(`tafseerId=50174`, `ayatId=40`), 2:32 (`tafseerId=50175`, `ayatId=41`), 2:33
(`tafseerId=50176`, `ayatId=42`), 2:34 (`tafseerId=50177`, `ayatId=43`), 2:35
(`tafseerId=50178`, `ayatId=44`), 2:36 (`tafseerId=54507`, `ayatId=45`), 2:37
(`tafseerId=50179`, `ayatId=46`), 2:38 (`tafseerId=50180`, `ayatId=47`), 2:39
(`tafseerId=54508`, `ayatId=48`), 2:40 (`tafseerId=50181`, `ayatId=49`), 2:41
(`tafseerId=50182`, `ayatId=50`), and 2:42 (`tafseerId=50183`, `ayatId=51`), all in draft
review. Ayat 2:2 has no source tafseer row.
Tafseer IDs are not always sequential, so ordering follows surah and ayat numbers.
The entries remain together because the file is below the 1,000-line limit. The entries
preserve the complete source explanations while simplifying vocabulary and sentence structure.
Each completed entry also includes the directly transliterated `trans_type=2` Kanz-ul-Irfan
Quran translation before its Easy Roman Urdu tafseer adaptation.

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

New or substantially changed files must contain at most 1,000 lines. Split only at logical
section or entry boundaries; never split a sentence, quotation, citation, numbered item,
or traceable adapted entry. Existing oversized files may remain unchanged unless they are
otherwise edited.
