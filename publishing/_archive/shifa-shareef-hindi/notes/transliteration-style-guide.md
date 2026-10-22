# Transliteration Style Guide

## Core Rule

This is transliteration, not translation. Preserve the Roman Urdu wording, tone, and Islamic vocabulary. Convert the script manually into Devanagari. Do not paraphrase, reword, or "translate" the meaning.

## Source

Source of truth: `content/books/shifa-shareef.json` (Roman Urdu edition, Sadr al-Afazil Urdu translation rendered in Roman script). Each section is traceable to its `slug` and printed page number.

## No Script Rule

Do not use an automated Roman Urdu to Devanagari transliteration script for the manuscript. Work in reviewed manual batches.

## Preferred Forms

- `Shifa Shareef` -> `शिफ़ा शरीफ़`
- `Huzoor` -> `हुज़ूर`
- `Mustafa` -> `मुस्तफ़ा`
- `Sarware Kainat` -> `सरवरे काइनात`
- `Mahboobe Khuda` -> `महबूबे ख़ुदा`
- `Allah` -> `अल्लाह`
- `Rasoolullah` -> `रसूलुल्लाह`
- `Quran` -> `क़ुरआन`
- `hadees` -> `हदीस`
- `Sahaba` -> `सहाबा`
- `Auliya` -> `औलिया`
- `nafs` -> `नफ़्स`
- `akhirat` -> `आख़िरत`

## Superscript Honorifics

Render common Islamic honorifics in Arabic superscript form, matching the English `Shifa Shareef` publishing workflow and the `Ikhteyarate Mustafa` Hindi project.

- `azzawajall`, `azza wa jall`, `عز وجل` -> `<sup>عز وجل</sup>`
- `rahimahullahu ta'ala`, `rahmatallahu ta'ala alaih`, `rahmatullahi alaih`, `رحمة الله تعالى عليه` -> `<sup>رحمة الله تعالى عليه</sup>`
- `radiallaho ta'ala anho`, `radiyallahu ta'ala anhu` -> `<sup>رضي الله تعالى عنه</sup>`
- `radiallaho ta'ala anha`, `radiyallahu ta'ala anha` -> `<sup>رضي الله تعالى عنها</sup>`
- `radiallaho ta'ala anhuma`, `radiyallahu ta'ala anhuma` -> `<sup>رضي الله تعالى عنهما</sup>`
- `alaihissalam`, where used as an honorific after a Prophet or angel -> `<sup>عليه السلام</sup>`
- `hafizahullahu ta'ala` -> `<sup>حفظه الله تعالى</sup>`

## Nukta Usage

Use nukta letters where they preserve Urdu/Arabic pronunciation:

- ख़, ग़, ज़, फ़, क़

Examples:

- `khusoosiyaat` -> `ख़ुसूसियात`
- `ghaib` -> `ग़ैब`
- `zikr` -> `ज़िक्र`
- `farmaaya` -> `फ़रमाया`
- `qism` -> `क़िस्म`
- `maqbooliyat` -> `मक़बूलियत`
- `tashreef` -> `तशरीफ़`
- `faida` -> `फ़ायदा`

## Honorifics

Keep `ﷺ` as-is.

Arabic honorifics may remain Arabic if present in the source, but Roman honorifics should generally be transliterated into Devanagari unless we later decide to standardize them as Arabic superscripts for print.

## English Words

Keep unmistakably English words (e.g. `publish`, `Transliteration`, `word`) as-is where they appear in the source; transliterate the surrounding Urdu vocabulary.

## Arabic Protective Phrases

Render `maaz Allah`, `ma'az Allah`, and similar forms as Arabic `معاذ الله`. Do not superscript it.

## Review Checks

Before completing a batch, check for:

- accidental English translation instead of transliteration
- missing `ﷺ`
- Roman honorifics not converted to Arabic superscript
- inconsistent spellings of `हुज़ूर`, `मुस्तफ़ा`, `अल्लाह`, `क़ुरआन`, `हदीस`
- leftover Roman Urdu in newly transliterated sections
