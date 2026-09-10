# Sirat-ul-Jinan Easy Roman Urdu Adaptation Plan

## Objective

Rewrite the Urdu tafseer of _Sirat-ul-Jinan fi Tafseer-il-Quran_ into simple, readable
Roman Urdu for readers who find the original Urdu vocabulary or sentence structure hard.

This is an easy-language adaptation, not a script-only transliteration. Simplify difficult
words, idioms, and sentence structures while preserving the complete explanation, meaning,
sequence, evidence, citations, quotations, and devotional tone.

## Project Boundary

This project is independent from `publishing/siratul-jinan-roman-urdu/`, which remains a
literal Urdu-to-Roman transliteration. Do not overwrite or silently substitute the literal
transliteration with this adaptation.

## Source and Traceability

Use the repository QuranDB at:

`db/qurandb.db`

This copied repository database is the authoritative source of truth; do not use the
older extracted or live-Quran database for production coverage.

Use `tafseer.tafseertypeId = 3` for Sirat-ul-Jinan and read the complete explanation from
`tafseer.tafseerNotHTML`.

Each adapted entry must preserve its `tafseerId`, `ayatId`, surah, ayat number, para, and
volume in the working batch. The Urdu source remains the authority for meaning and content.
Each batch must also extract the corresponding Quran translation from the same QuranDB
source using `translation.trans_type=2` (Kanz-ul-Irfan, Sirat). That translation is to be
transliterated into Roman Urdu, not translated or paraphrased.

### Missing tafseer rows

An aayat with no tafseer row must receive its own separate manuscript entry. Extract its
Arabic from the Quran/aayaat table and its Kanz-ul-Irfan translation using
`translation.trans_type=2`. The entry contains only that Arabic and translation, with no
tafseer prose. Its metadata must use `tafseerId=null` and include the individual `surah`,
`ayat`, and `ayatId`. Never fabricate explanation text.

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

The current An-Nisa manuscript contains available entries 4:1 through 4:11, the standalone
missing-tafseer entry 4:12 (`tafseerId=null`, `ayatId=509`), and 4:13 in source order. Ayat
4:12 has no Sirat-ul-Jinan tafseer row; its entry therefore contains only the exact Quranic
Arabic and the `trans_type=2` Kanz-ul-Irfan translation transliteration.

Ayat 4:14 (`ayatId=511`) was then added as the next standalone missing-tafseer entry with
`tafseerId=null`. Ayat 4:15 (`tafseerId=50596`, `ayatId=512`) was appended after it with its
complete source adaptation, Arabic, translation transliteration, explanations, quotations,
ahadees, and citations.

Ayat 4:16 (`tafseerId=50597`, `ayatId=513`) and 4:17 (`tafseerId=50598`, `ayatId=514`) were
then appended to the same active manuscript file with their complete Arabic, translation
transliterations, explanations, quotations, legal distinctions, and footnote preserved.

The next ten available entries, Ayat 4:18–4:27, were completed in two verified five-entry
batches in the same manuscript file. The first batch covers `tafseerId=50599–50603` and
`ayatId=515–519`; the second covers `tafseerId=50604–50608` and `ayatId=520–524`. The file
remains below the 1,000-line limit.

The following ten available entries, Ayat 4:28–4:37, were completed in two verified
five-entry batches. Ayat 4:28–4:35 (`tafseerId=50609`, `51245`, and `50610–50614`) were
appended to `01-surah-an-nisa-easy-roman-01.md`, which reached 906 lines. Ayat 4:36–4:37
(`tafseerId=50615–50616`) began `02-surah-an-nisa-easy-roman-02.md` at the required complete
entry boundary.

The following ten available entries, Ayat 4:38–4:47, were completed in two verified
five-entry batches in `02-surah-an-nisa-easy-roman-02.md`. The first batch covers
`tafseerId=50617–50621` and the second covers `tafseerId=50622–50626`; the active file remains
below the 1,000-line limit at 285 lines.

The entries Ayat 4:48–4:58 were completed in two five-entry batches in the same file. Ayat
4:52 has no tafseer row, so it was added as a standalone entry with `tafseerId=null`,
`ayatId=549`, its exact Arabic, and its `trans_type=2` translation. The active file remains
below the 1,000-line limit.

The consecutive ten-ayat session for Ayat 4:59–4:68 was completed in two verified batches in
`02-surah-an-nisa-easy-roman-02.md`. Ayat 4:59–4:61 and 4:64–4:66 contain complete tafseer;
Ayat 4:62–4:63 and 4:67–4:68 were added as standalone `tafseerId=null` entries with exact
Arabic and `trans_type=2` translations. The active file is 690 lines.

The next consecutive session, Ayat 4:69–4:78, was completed in two verified batches in the
same file. Ayat 4:69–4:72 and 4:74–4:76, 4:78 contain complete tafseer; Ayat 4:73 and 4:77
were added as standalone `tafseerId=null` entries with exact Arabic and `trans_type=2`
translations. The active file is 868 lines.

The next five-entry batch, Ayat 4:79–4:83 (`tafseerId=50650–50654`, `ayatId=576–580`), was
appended to the same active file. All five rows have complete Sirat-ul-Jinan tafseer and use
the complete `tafseerText` fallback because `tafseerNotHTML` is NULL; only HTML/export markup
was removed. The batch preserves exact Arabic, directly transliterated Kanz-ul-Irfan
translations, complete explanations, quotations, citations, honorifics, and source order. The
active file is 941 lines and remains below the 1,000-line limit.

The following five-entry batch, Ayat 4:84–4:88 (`tafseerId=50655–50659`, `ayatId=581–585`),
was added to `03-surah-an-nisa-easy-roman-03.md` because the next complete entry would have
exceeded the 1,000-line limit in the previous file. All five rows have complete Sirat-ul-Jinan
tafseer and preserve exact Arabic, directly transliterated Kanz-ul-Irfan translations,
complete explanations, quotations, citations, honorifics, and source order. The new file is
132 lines.

2:212 (`tafseerId=50338`, `ayatId=221`) through 2:216 (`tafseerId=50342`, `ayatId=225`) were appended to `05-surah-al-baqarah-easy-roman-05.md` as the first five-ayat batch. The next complete entry would exceed the 1,000-line boundary, so 2:217 (`tafseerId=50343`, `ayatId=226`) through 2:221 (`tafseerId=50347`, `ayatId=230`) were added to `06-surah-al-baqarah-easy-roman-06.md` as the second five-ayat batch. All ten entries remain draft adaptations with extracted Kanz-ul-Irfan translations, Arabic, explanations, quotations, citations, and source order preserved.

2:222 (`tafseerId=50348`, `ayatId=231`) through 2:226 (`tafseerId=50352`, `ayatId=235`) were appended to `06-surah-al-baqarah-easy-roman-06.md` as the first five-ayat batch. 2:227 (`tafseerId=50353`, `ayatId=236`) through 2:231 (`tafseerId=50357`, `ayatId=240`) were appended as the second five-ayat batch. All ten entries include their complete Kanz-ul-Irfan translation transliterations, Arabic, rulings, explanations, quotations, hadith, and citations in source order; the active file remains below the 1,000-line limit.
2:232 (`tafseerId=50358`, `ayatId=241`) through 2:236 (`tafseerId=50362`, `ayatId=245`) were appended to `06-surah-al-baqarah-easy-roman-06.md` as the first five-ayat batch. 2:237 (`tafseerId=50363`, `ayatId=246`) through 2:241 (`tafseerId=50367`, `ayatId=250`) were appended as the second five-ayat batch. All ten entries include their complete Kanz-ul-Irfan translation transliterations, Arabic, rulings, explanations, quotations, and citations in source order; the active file remains below the 1,000-line limit.

2:242 (`tafseerId=54518`, `ayatId=251`) through 2:246 (`tafseerId=50370`, `ayatId=255`) were appended to `06-surah-al-baqarah-easy-roman-06.md` as the first verified five-ayat batch. 2:247 (`tafseerId=50371`, `ayatId=256`) through 2:251 (`tafseerId=50374`, `ayatId=260`) were appended as the second verified five-ayat batch. All ten entries remain draft adaptations with complete Kanz-ul-Irfan transliterations, Arabic, explanations, quotations, citations, and source order preserved; the active file is 695 lines and remains below the 1,000-line limit.
2:252 (`tafseerId=50375`, `ayatId=261`) through 2:261 (`tafseerId=50384`, `ayatId=270`) were appended to `06-surah-al-baqarah-easy-roman-06.md` in two verified five-ayat batches. All ten entries remain draft adaptations with complete Kanz-ul-Irfan transliterations, Arabic, explanations, rulings, quotations, poetry, hadith, citations, and source order preserved; the active file remains below the 1,000-line limit.
2:262 (`tafseerId=50385`, `ayatId=271`) through 2:266 (`tafseerId=50389`, `ayatId=275`) were appended to `06-surah-al-baqarah-easy-roman-06.md` as the first verified five-ayat batch. The file reached 923 lines. 2:267 (`tafseerId=50390`, `ayatId=276`) through 2:271 (`tafseerId=50394`, `ayatId=280`) were added to `07-surah-al-baqarah-easy-roman-07.md` as the second verified five-ayat batch because the next complete entry would exceed the 1,000-line limit. All ten entries remain draft adaptations with complete Kanz-ul-Irfan transliterations, Arabic, explanations, rulings, quotations, hadith, citations, and source order preserved.
2:272 (`tafseerId=50395`, `ayatId=281`) through 2:276 (`tafseerId=50399`, `ayatId=285`) were appended to `07-surah-al-baqarah-easy-roman-07.md` as the first verified five-ayat batch. The authoritative database has no tafseer row for 2:277. 2:278 (`tafseerId=50400`, `ayatId=287`) through 2:281 (`tafseerId=50403`, `ayatId=290`) were appended as the second verified batch. The nine available entries remain draft adaptations with complete Kanz-ul-Irfan transliterations, Arabic, explanations, rulings, quotations, duas, and citations preserved; the active file remains below the 1,000-line limit.
2:282 (`tafseerId=50404`, `ayatId=291`) through 2:286 (`tafseerId=50408`, `ayatId=295`) were appended to `07-surah-al-baqarah-easy-roman-07.md` as the next five available complete entries. The authoritative database has no tafseer rows for 2:287 through 2:291, so no entries were fabricated. These five draft adaptations preserve the extracted Arabic, Kanz-ul-Irfan translation transliterations, complete source explanations, rulings, quotations, poetry, duas, and citations; the active file remains below the 1,000-line limit.

The next ten available complete entries begin Surah Aal-e-Imran: 3:1 (`tafseerId=50409`, `ayatId=297`), 3:3 (`50411`, `299`), 3:5 (`50412`, `301`), 3:6 (`50413`, `302`), 3:7 (`50414`, `303`), 3:8 (`50415`, `304`), 3:9 (`50416`, `305`), 3:10 (`50417`, `306`), 3:12 (`50418`, `308`), and 3:13 (`50419`, `309`). The authoritative database has no tafseer rows for 3:2, 3:4, or 3:11; no entries were fabricated. All ten draft adaptations were added to `01-surah-aal-e-imran-easy-roman-01.md` at complete entry boundaries with the extracted Arabic, directly transliterated Kanz-ul-Irfan translations, explanations, quotations, citations, and source ordering preserved.

The next ten available complete entries, 3:14 (`tafseerId=50420`, `ayatId=310`), 3:15 (`50421`, `311`), 3:17 (`50422`, `313`), 3:18 (`50423`, `314`), 3:19 (`50424`, `315`), 3:20 (`50425`, `316`), 3:21 (`50426`, `317`), 3:22 (`50427`, `318`), 3:23 (`50428`, `319`), and 3:24 (`50429`, `320`), were appended to `01-surah-aal-e-imran-easy-roman-01.md` in two verified five-entry batches. The authoritative database has no tafseer row for 3:16, so no entry was fabricated. All ten draft adaptations preserve the extracted Arabic, directly transliterated Kanz-ul-Irfan translations, complete explanations, quotations, duas, footnotes, citations, and source order; the active file remains below the 1,000-line limit.

The next ten available complete entries, 3:37 (`tafseerId=50441`, `ayatId=333`) through 3:46 (`50450`, `342`), were appended to `01-surah-aal-e-imran-easy-roman-01.md` as two verified five-entry batches. The authoritative database has no missing tafseer rows in 3:37–3:46. All ten draft adaptations preserve the extracted Arabic, directly transliterated Kanz-ul-Irfan translations, complete explanations, quotations, Quranic citations, honorifics, and source order; the active file remains below the 1,000-line limit.

The next ten available complete entries, 3:47 (`tafseerId=50451`, `ayatId=343`), 3:48 (`50452`, `344`), 3:50 (`50453`, `346`), 3:51 (`50454`, `347`), 3:52 (`50455`, `348`), 3:54 (`50456`, `350`), 3:55 (`50457`, `351`), 3:56 (`50458`, `352`), 3:59 (`50459`, `355`), and 3:60 (`50460`, `356`), were appended to `01-surah-aal-e-imran-easy-roman-01.md` in two verified five-entry batches. The authoritative database has no tafseer rows for 3:49, 3:53, 3:57, or 3:58; no entries were fabricated. All ten draft adaptations preserve the extracted Arabic, directly transliterated Kanz-ul-Irfan translations, complete explanations, miracle details, aqaaid-o-masaa'il, quotations, ahadees, citations, honorifics, and source order; the active file is 863 lines and remains below the 1,000-line limit.

The next nine available complete entries, 3:61 (`tafseerId=50461`, `ayatId=357`), 3:62 (`50462`, `358`), 3:64 (`50463`, `360`), 3:65 (`50464`, `361`), 3:66 (`50465`, `362`), 3:68 (`50466`, `364`), 3:69 (`50467`, `365`), 3:70 (`50468`, `366`), and 3:71 (`50469`, `367`), were appended in two verified batches. The authoritative database has no tafseer rows for 3:63 or 3:67; no entries were fabricated. The first five-entry batch was appended to `01-surah-aal-e-imran-easy-roman-01.md`, which reached 943 lines. Because the next complete entry would exceed the 1,000-line boundary, the second available-entry batch was started at the complete boundary in `02-surah-aal-e-imran-easy-roman-02.md`. All nine draft adaptations preserve the extracted Arabic, directly transliterated Kanz-ul-Irfan translations, complete mubahala account, explanations, quotations, footnote, citations, honorifics, and source order.

The next ten available complete entries, 3:72 (`tafseerId=50470`, `ayatId=368`), 3:73 (`50471`, `369`), 3:74 (`50472`, `370`), 3:75 (`50473`, `371`), 3:76 (`50474`, `372`), 3:77 (`50475`, `373`), 3:78 (`50476`, `374`), 3:79 (`50477`, `375`), 3:81 (`50478`, `377`), and 3:83 (`50479`, `379`), were appended to `02-surah-aal-e-imran-easy-roman-02.md` in two verified five-entry batches. The authoritative database has no tafseer rows for 3:80 or 3:82; no entries were fabricated. The manuscript remains below the 1,000-line limit and preserves the extracted Arabic, directly transliterated Kanz-ul-Irfan translations, explanations, citations, honorifics, and source order.

The next ten available complete entries, 3:84 (`tafseerId=50480`, `ayatId=380`), 3:85 (`50481`, `381`), 3:86 (`50482`, `382`), 3:87 (`50483`, `383`), 3:90 (`50484`, `386`), 3:91 (`50485`, `387`), 3:92 (`50486`, `388`), 3:93 (`50487`, `389`), 3:94 (`50488`, `390`), and 3:95 (`50489`, `391`), were appended to `02-surah-aal-e-imran-easy-roman-02.md` in two verified five-entry batches. The authoritative database has no tafseer rows for 3:88 or 3:89; no entries were fabricated. The manuscript remains below the 1,000-line limit and preserves the extracted Arabic, directly transliterated Kanz-ul-Irfan translations, explanations, citations, honorifics, and source order.

The next ten available complete entries, 3:96 (`tafseerId=50490`, `ayatId=392`) through 3:105 (`50499`, `401`), were appended to `02-surah-aal-e-imran-easy-roman-02.md` in two verified five-entry batches. These entries cover the Ka'bah and Hajj, protection of imaan, Muslim unity, holding firmly to Allah's rope, enjoining good, and avoiding division. The manuscript remains below the 1,000-line limit and preserves the extracted Arabic, directly transliterated Kanz-ul-Irfan translations, explanations, rulings, citations, honorifics, and source order.

The next ten available complete entries, 3:106 (`tafseerId=50500`, `ayatId=402`), 3:107 (`50501`, `403`), 3:108 (`50502`, `404`), 3:110 (`50503`, `406`), 3:111 (`50504`, `407`), 3:112 (`50505`, `408`), 3:113 (`50506`, `409`), 3:114 (`50507`, `410`), 3:115 (`50508`, `411`), and 3:116 (`50509`, `412`), were appended to `02-surah-aal-e-imran-easy-roman-02.md` in two verified five-entry batches. The authoritative database has no tafseer row for 3:109; no entry was fabricated. These entries cover the Qiyamat scene, virtues of the best Ummah, Ahl-e-Kitaab, and the consequences of kufr; the manuscript remains below the 1,000-line limit.

The next ten available complete entries, 3:117 (`tafseerId=50510`, `ayatId=413`), 3:118 (`50511`, `414`), 3:119 (`50512`, `415`), 3:120 (`50513`, `416`), 3:121 (`50514`, `417`), 3:122 (`50515`, `418`), 3:123 (`50516`, `419`), 3:124 (`50517`, `420`), 3:126 (`50518`, `422`), and 3:127 (`50519`, `423`), were appended to `02-surah-aal-e-imran-easy-roman-02.md` in two verified five-entry batches. The authoritative database has no tafseer row for 3:125; no entry was fabricated. These entries cover wasted disbelievers' spending, hostile confidants, Ghazwa-e-Uhud, Ghazwa-e-Badr, tawakkul, and angelic help.

The next ten available complete entries, 3:128 (`tafseerId=50521`, `ayatId=424`), 3:130 (`50522`, `426`), 3:131 (`50523`, `427`), 3:132 (`50524`, `428`), 3:133 (`50525`, `429`), 3:134 (`50526`, `430`), 3:135 (`50527`, `431`), 3:137 (`50528`, `433`), 3:138 (`50529`, `434`), and 3:139 (`50530`, `435`), were appended to `02-surah-aal-e-imran-easy-roman-02.md` in two verified five-entry batches. The authoritative database has no tafseer rows for 3:129 or 3:136; no entries were fabricated. These entries cover the lesson of Bir-e-Ma'oona, the prohibition of sood, obedience, Jannat, spending, forgiveness, repentance, reflection on past nations, and courage after Uhud.

The next ten available complete entries, 3:140 (`tafseerId=50531`, `ayatId=436`) through 3:149 (`50540`, `445`), were appended to `02-surah-aal-e-imran-easy-roman-02.md` in two verified five-entry batches. These entries cover the lessons of Uhud, patience, martyrdom, steadfastness after the Prophet's ﷺ wisal, intention, the courage of earlier Ambiya, dua, worldly and Aakhirat rewards, and avoiding the ways of disbelievers.

Revision audit: the shortened Easy Roman Urdu adaptations were identified as beginning at 3:72 (`tafseerId=50470`). Entries 3:72–3:159 were revised against the complete source records, with all available source details restored. Because of the 1,000-line manuscript limit, the revised continuation is split at complete entry boundaries across files 02, 03, and 04. Exact Arabic was checked directly against SQLite after revision; missing tafseer rows were not fabricated. The verified 3:150–3:159 session batch remains in file 04; the next source gap at 3:163 remains intentionally absent.

The continuation in `04-surah-aal-e-imran-easy-roman-04.md` includes the five available entries 3:160–3:165, with 3:163 and 3:166 absent because the authoritative database has no tafseer rows for them. The next ten available entries, 3:167 (`tafseerId=50557`, `ayatId=463`), 3:168 (`50558`, `464`), 3:169 (`50559`, `465`), 3:170 (`50560`, `466`), 3:171 (`50561`, `467`), 3:172 (`50562`, `468`), 3:173 (`50563`, `469`), 3:175 (`50564`, `471`), 3:176 (`50565`, `472`), and 3:177 (`50566`, `473`), were appended in two verified five-entry batches. The authoritative database has no tafseer row for 3:174, so no entry was fabricated. The adaptations preserve exact Quranic Arabic, separate Kanz-ul-Irfan transliterations, complete source explanations, Uhud and shuhada accounts, poetry, hadith, Arabic dua, citations, honorifics, and source order. The active file is 609 lines and remains below the 1,000-line limit.

The next five available entries, 3:178 (`tafseerId=50567`, `ayatId=474`), 3:179 (`tafseerId=51243`, `ayatId=475`), 3:180 (`50568`, `476`), 3:181 (`50569`, `477`), and 3:183 (`50570`, `479`), were appended to `04-surah-aal-e-imran-easy-roman-04.md`. The authoritative database has no tafseer row for 3:182, so no entry was fabricated. The batch preserves exact Quranic Arabic, separate Kanz-ul-Irfan transliterations, source explanations, citations, and source order; the active file remains below the 1,000-line limit.

The next ten available entries were processed in two separate five-entry batches as required by the workflow rule. Batch 1 contains 3:184 (`tafseerId=50571`, `ayatId=480`), 3:185 (`tafseerId=51244`, `481`), 3:186 (`50572`, `482`), 3:187 (`50573`, `483`), and 3:188 (`50574`, `484`). Batch 2 contains 3:189 (`50575`, `485`), 3:190 (`50576`, `486`), 3:191 (`50577`, `487`), 3:192 (`50578`, `488`), and 3:195 (`50579`, `491`). The authoritative database has no tafseer rows for 3:193 or 3:194, so no entries were fabricated. Batch 1 was validated before Batch 2 was started; the final active manuscript is 867 lines and preserves source order, Arabic, Kanz-ul-Irfan transliterations, explanations, citations, and honorifics.

The second five-entry batch for An-Nisa contains 4:94 (`tafseerId=50665`, `ayatId=591`), 4:95 (`50666`, `592`), 4:96 (`50667`, `593`), 4:97 (`50668`, `594`), and 4:98 (`50669`, `595`). These entries were appended to `03-surah-an-nisa-easy-roman-03.md` after the preceding 4:84–4:88 batch. All five preserve exact Arabic, directly transliterated Kanz-ul-Irfan translations, complete `tafseerText` explanations, rulings, hadith, quotations, citations, honorifics, and source order. `tafseerNotHTML` is NULL for these rows, so only HTML/export markup was removed; the active file is 356 lines and remains below the 1,000-line limit.

The complete consecutive session for Ayat 4:89–4:98 was verified in two five-entry batches in
`03-surah-an-nisa-easy-roman-03.md`. Ayat 4:89–4:93 (`tafseerId=50660–50664`, `ayatId=586–590`)
and Ayat 4:94–4:98 (`tafseerId=50665–50669`, `ayatId=591–595`) all have complete tafseer
rows. Exact Arabic, directly transliterated Kanz-ul-Irfan translations, complete source
explanations, citations, honorifics, and source order were preserved. The active file is 356
lines.

The consecutive session for Ayat 4:99–4:108 was completed in two verified five-entry batches
in `03-surah-an-nisa-easy-roman-03.md`. Ayat 4:99 and 4:106 had no tafseer rows and were added
as standalone `tafseerId=null` entries with exact Arabic and `trans_type=2` translations.
The remaining entries used complete Sirat-ul-Jinan tafseer rows. Exact Arabic, translations,
source explanations, citations, honorifics, and source order were preserved; the active file
is 566 lines.

The consecutive session for Ayat 4:109–4:118 was completed in two verified five-entry batches
in `03-surah-an-nisa-easy-roman-03.md`. Ayat 4:111 and 4:112 had no tafseer rows and were
added as standalone `tafseerId=null` entries with exact Arabic and `trans_type=2` translations.
The remaining entries used complete Sirat-ul-Jinan tafseer rows. Exact Arabic, translations,
source explanations, citations, honorifics, and source order were preserved; the active file
is 768 lines.

The consecutive session for Ayat 4:119–4:128 was completed in two verified five-entry batches
in `03-surah-an-nisa-easy-roman-03.md`. Ayat 4:121, 4:122, and 4:124 had no tafseer rows and
were added as standalone `tafseerId=null` entries with exact Arabic and `trans_type=2`
translations. The remaining entries used complete Sirat-ul-Jinan tafseer rows, including
`tafseerId=51442` for Ayat 4:127. Exact Arabic, translations, source explanations, citations,
honorifics, and source order were preserved; the active file is 952 lines.
