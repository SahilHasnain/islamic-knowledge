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
(`tafseerId=50182`, `ayatId=50`), 2:42 (`tafseerId=50183`, `ayatId=51`), 2:43
(`tafseerId=50184`, `ayatId=52`), and 2:44 (`tafseerId=50185`, `ayatId=53`), all in draft
(`tafseerId=50186`, `ayatId=54`), and 2:46 (`tafseerId=54509`, `ayatId=55`), all in draft
(`tafseerId=50187`, `ayatId=56`), 2:48 (`tafseerId=50188`, `ayatId=57`), 2:49
(`tafseerId=50189`, `ayatId=58`), and 2:50 (`tafseerId=50190`, `ayatId=59`), all in draft
(`tafseerId=50191`, `ayatId=60`), 2:52 (`tafseerId=54510`, `ayatId=61`), 2:53
(`tafseerId=50192`, `ayatId=62`), and 2:54 (`tafseerId=50193`, `ayatId=63`), all in draft
2:55 (`tafseerId=50194`, `ayatId=64`), 2:56 (`tafseerId=54511`, `ayatId=65`), 2:57
(`tafseerId=50195`, `ayatId=66`), 2:58 (`tafseerId=50196`, `ayatId=67`), 2:59
(`tafseerId=50197`, `ayatId=68`), 2:60 (`tafseerId=50198`, `ayatId=69`), 2:61
(`tafseerId=50199`, `ayatId=70`), 2:62 (`tafseerId=50200`, `ayatId=71`), 2:63
(`tafseerId=54512`, `ayatId=72`), and 2:64 (`tafseerId=50201`, `ayatId=73`), 2:65
(`tafseerId=50202`, `ayatId=74`), 2:66 (`tafseerId=50203`, `ayatId=75`), 2:67
(`tafseerId=50204`, `ayatId=76`), 2:68 (`tafseerId=54520`, `ayatId=77`), and 2:69
(`tafseerId=54521`, `ayatId=78`), all in draft
2:70 (`tafseerId=54522`, `ayatId=79`), 2:71 (`tafseerId=50205`, `ayatId=80`), 2:72
(`tafseerId=50206`, `ayatId=81`), 2:73 (`tafseerId=50207`, `ayatId=82`), and 2:74
(`tafseerId=50208`, `ayatId=83`), all in draft
2:75 (`tafseerId=50209`, `ayatId=84`) through 2:84 (`tafseerId=50216`, `ayatId=93`),
all in draft in `03-surah-al-baqarah-easy-roman-03.md`
2:85 (`tafseerId=50217`, `ayatId=94`) through 2:94 (`tafseerId=50225`, `ayatId=103`),
all in draft, appended to `03-surah-al-baqarah-easy-roman-03.md`
2:95 (`tafseerId=50226`, `ayatId=104`) through 2:104 (`tafseerId=50235`, `ayatId=113`),
all in draft, appended to `03-surah-al-baqarah-easy-roman-03.md`
2:105 (`tafseerId=50236`, `ayatId=114`) through 2:114 (`tafseerId=50245`, `ayatId=123`),
all in draft, appended to `03-surah-al-baqarah-easy-roman-03.md`
2:115 (`tafseerId=50246`, `ayatId=124`) through 2:124 (`tafseerId=50255`, `ayatId=133`),
all in draft, appended to `03-surah-al-baqarah-easy-roman-03.md` after removing a duplicate
2:105–2:114 suffix; the active file remains below the 1,000-line limit.
2:125 (`tafseerId=50256`, `ayatId=134`) through 2:134 (`tafseerId=50264`, `ayatId=143`),
with 2:132 using non-sequential `tafseerId=54513`, all in draft, appended to
`03-surah-al-baqarah-easy-roman-03.md`; the active file remains below the 1,000-line limit.
2:135 (`tafseerId=50265`, `ayatId=144`) through 2:141 (`tafseerId=50271`, `ayatId=150`),
all in draft, appended to `03-surah-al-baqarah-easy-roman-03.md`. These entries are the
remaining Para 1 rows before the source continues at Para 2.
2:142 (`tafseerId=50272`, `ayatId=151`) was appended to `03-surah-al-baqarah-easy-roman-03.md`.
The next complete entry exceeded the 1,000-line continuity boundary, so 2:143
(`tafseerId=50273`, `ayatId=152`) and 2:144 (`tafseerId=50274`, `ayatId=153`) were appended to
`04-surah-al-baqarah-easy-roman-04.md`. The remaining available entries begin at 2:145.
2:145 (`tafseerId=50275`, `ayatId=154`) through 2:151 (`tafseerId=50281`, `ayatId=160`)
were appended to `04-surah-al-baqarah-easy-roman-04.md`; the active file remains below the
1,000-line limit.
review. Ayat 2:2 has no source tafseer row.
Tafseer IDs are not always sequential, so ordering follows surah and ayat numbers.
The entries remain together because the file is below the 1,000-line limit. The entries
preserve the complete source explanations while simplifying vocabulary and sentence structure.
Each completed entry also includes the directly transliterated `trans_type=2` Kanz-ul-Irfan
Quran translation before its Easy Roman Urdu tafseer adaptation.
2:152 (`tafseerId=50282`, `ayatId=161`) through 2:161 (`tafseerId=50290`, `ayatId=170`),
including non-sequential `tafseerId=54514` for 2:160, were appended to
`04-surah-al-baqarah-easy-roman-04.md`. All ten entries are draft adaptations with their
complete Kanz-ul-Irfan translation transliterations, Arabic, explanations, quotations,
poetry, and citations preserved in source order; the active file remains below 1,000 lines.
2:162 (`tafseerId=50291`, `ayatId=171`) through 2:171 (`tafseerId=50300`, `ayatId=180`)
were appended to `04-surah-al-baqarah-easy-roman-04.md`. All ten entries are draft
adaptations with their complete Kanz-ul-Irfan translation transliterations, Arabic,
explanations, quotations, and citations preserved in source order; the file remains at
815 lines, so no new manuscript file was required.
2:172 (`tafseerId=50301`, `ayatId=181`) through 2:176 (`tafseerId=50305`, `ayatId=185`)
were appended to `04-surah-al-baqarah-easy-roman-04.md`. The file reached 923 lines at
the complete 2:176 entry, so the next complete entry would exceed the line limit.
2:177 (`tafseerId=50328`, `ayatId=186`) through 2:181 (`tafseerId=50309`, `ayatId=190`)
were added to `05-surah-al-baqarah-easy-roman-05.md`, beginning at the complete entry
boundary required by manuscript continuity. All ten entries include their complete
Kanz-ul-Irfan translation transliterations, Arabic, explanations, quotations, and
citations in source order and remain draft adaptations.
2:182 (`tafseerId=50310`, `ayatId=191`) through 2:191 (`tafseerId=50319`, `ayatId=200`) were appended to
`05-surah-al-baqarah-easy-roman-05.md`. All ten entries include their complete Kanz-ul-Irfan
translation transliterations, Arabic, explanations, quotations, and citations in source order;
the active file remains below the 1,000-line limit and the entries remain draft adaptations.
2:192 (`tafseerId=54515`, `ayatId=201`) through 2:201 (`tafseerId=50329`, `ayatId=210`) were appended to
`05-surah-al-baqarah-easy-roman-05.md`. All ten entries include their complete Kanz-ul-Irfan
translation transliterations, Arabic, explanations, quotations, and citations in source order;
the active file remains below the 1,000-line limit and the entries remain draft adaptations.
2:202 (`tafseerId=54516`, `ayatId=211`) through 2:211 (`tafseerId=50337`, `ayatId=220`) were appended to
`05-surah-al-baqarah-easy-roman-05.md` in two sequential five-ayat batches. All ten entries
include their complete Kanz-ul-Irfan translation transliterations, Arabic, honorifics,
explanations, quotations, and citations in source order; the active file remains below the
1,000-line limit and the entries remain draft adaptations.

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

## Manuscript Continuity Rule

The current manuscript file must remain active across batches and sessions. Do not create a
new manuscript file just because a batch or ayat range is complete. Continue appending complete
entries to the current file until it reaches 1,000 lines, or until the next complete entry would
make it exceed 1,000 lines. Only then create the next sequential file. The current file is not
considered closed until that point. Never split a complete entry or any of its paragraphs,
quotations, citations, or numbered discussions between files.

## Session Workflow Rule

Each translation session targets ten aayaat, processed as two sequential five-ayat batches.
The first five-ayat batch must be completed and verified before the second batch begins. The
session workflow is independent of manuscript files: both batches must append to the current
active manuscript file unless the manuscript continuity rule requires a new file.

2:212 (`tafseerId=50338`, `ayatId=221`) through 2:216 (`tafseerId=50342`, `ayatId=225`) were appended to `05-surah-al-baqarah-easy-roman-05.md` as the first five-ayat batch. The next complete entry would exceed the 1,000-line boundary, so 2:217 (`tafseerId=50343`, `ayatId=226`) through 2:221 (`tafseerId=50347`, `ayatId=230`) were added to `06-surah-al-baqarah-easy-roman-06.md` as the second five-ayat batch. All ten entries remain draft adaptations with extracted Kanz-ul-Irfan translations, Arabic, explanations, quotations, citations, and source order preserved.

2:222 (`tafseerId=50348`, `ayatId=231`) through 2:226 (`tafseerId=50352`, `ayatId=235`) were appended to `06-surah-al-baqarah-easy-roman-06.md` as the first five-ayat batch. 2:227 (`tafseerId=50353`, `ayatId=236`) through 2:231 (`tafseerId=50357`, `ayatId=240`) were appended as the second five-ayat batch. All ten entries include their complete Kanz-ul-Irfan translation transliterations, Arabic, rulings, explanations, quotations, hadith, and citations in source order; the active file remains below the 1,000-line limit.
2:232 (`tafseerId=50358`, `ayatId=241`) through 2:236 (`tafseerId=50362`, `ayatId=245`) were appended to `06-surah-al-baqarah-easy-roman-06.md` as the first five-ayat batch. 2:237 (`tafseerId=50363`, `ayatId=246`) through 2:241 (`tafseerId=50367`, `ayatId=250`) were appended as the second five-ayat batch. All ten entries include their complete Kanz-ul-Irfan translation transliterations, Arabic, rulings, explanations, quotations, and citations in source order; the active file remains below the 1,000-line limit.

2:242 (`tafseerId=54518`, `ayatId=251`) through 2:246 (`tafseerId=50370`, `ayatId=255`) were appended to `06-surah-al-baqarah-easy-roman-06.md` as the first verified five-ayat batch. 2:247 (`tafseerId=50371`, `ayatId=256`) through 2:251 (`tafseerId=50374`, `ayatId=260`) were appended as the second verified five-ayat batch. All ten entries remain draft adaptations with complete Kanz-ul-Irfan transliterations, Arabic, explanations, quotations, citations, and source order preserved; the active file is 695 lines and remains below the 1,000-line limit.
2:252 (`tafseerId=50375`, `ayatId=261`) through 2:261 (`tafseerId=50384`, `ayatId=270`) were appended to `06-surah-al-baqarah-easy-roman-06.md` in two verified five-ayat batches. All ten entries remain draft adaptations with complete Kanz-ul-Irfan transliterations, Arabic, explanations, rulings, quotations, poetry, hadith, citations, and source order preserved; the active file remains below the 1,000-line limit.
2:262 (`tafseerId=50385`, `ayatId=271`) through 2:266 (`tafseerId=50389`, `ayatId=275`) were appended to `06-surah-al-baqarah-easy-roman-06.md` as the first verified five-ayat batch. The file reached 923 lines. 2:267 (`tafseerId=50390`, `ayatId=276`) through 2:271 (`tafseerId=50394`, `ayatId=280`) were added to `07-surah-al-baqarah-easy-roman-07.md` as the second verified five-ayat batch because the next complete entry would exceed the 1,000-line limit. All ten entries remain draft adaptations with complete Kanz-ul-Irfan transliterations, Arabic, explanations, rulings, quotations, hadith, citations, and source order preserved.
