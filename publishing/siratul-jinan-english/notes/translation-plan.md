# Sirat-ul-Jinan Standard English Translation Plan

## Objective

Produce a complete, faithful standard English translation of Sirat-ul-Jinan for surahs containing
no more than 20 aayaat, ordered by increasing aayat count and then surah number.

## Eligible Surahs

| Aayaat | Surahs |
|---:|---|
| 3 | 103, 108, 110 |
| 4 | 106, 112 |
| 5 | 97, 105, 111, 113 |
| 6 | 109, 114 |
| 7 | 1, 107 |
| 8 | 94, 95, 98, 99, 102 |
| 9 | 104 |
| 11 | 62, 63, 93, 100, 101 |
| 12 | 65, 66 |
| 13 | 60 |
| 14 | 61 |
| 15 | 91 |
| 17 | 86 |
| 18 | 49, 64 |
| 19 | 82, 87, 96 |
| 20 | 73, 90 |

## Workflow

Process one surah at a time in sequential batches of up to five aayaat. Verify each batch before
continuing. Keep one manuscript file per surah unless the 1,000-line limit requires a sequential
split at a complete entry boundary.

## Current Progress

- Project initialized.
- Surah 103, Al-'Asr, completed in `manuscript/01-surah-al-asr/01-surah-al-asr-english-01.md`.
- Surah 103 has one complete tafseer row (`tafseerId=54481`) and two standalone
  `tafseerId=null` entries for Ayat 103:2–3.
- The manuscript contains 81 lines; Arabic, metadata, source order, English Quran translations,
  and complete tafseer coverage were verified.
- Quran translations use QuranDB English Kanz-ul-Iman (`language_code='en'`, `trans_type='3'`).
- Surah 108, Al-Kawthar, completed in `manuscript/02-surah-al-kawthar/01-surah-al-kawthar-english-01.md`.
- Surah 108 has one complete tafseer row (`tafseerId=54491`) and two standalone
  `tafseerId=null` entries for Ayat 108:2–3.
- The manuscript contains 86 lines; Arabic, QuranDB English translations, metadata, source order,
  and complete tafseer coverage were verified.
- The next four-batch session covered 16 complete aayaat: An-Nasr 110:1–3, Al-Kafirun 106:1–4,
  Al-Ikhlas 112:1–4, and Al-Qadr 97:1–5. The four surahs were processed sequentially through
  subagents and independently verified. Missing tafseer entries were preserved as standalone
  translation-only records: 110:2–3, 106:2–4, 112:2–4, and 97:3 and 97:5. The manuscripts
  contain 50, 70, 42, and 96 lines respectively. Arabic, QuranDB English Kanz-ul-Iman
  translations, metadata, ordering, and source completeness were verified.
- Next surah: 105, Al-Fil, 5 aayaat.
- The next four-batch session covered 21 complete aayaat: Al-Fil 105:1–5, Al-Lahab 111:1–5,
  Al-Falaq 113:1–5, and Al-Kafirun 109:1–6. The four surahs were processed sequentially through
  subagents and independently verified. Missing tafseer entries were preserved as standalone
  translation-only records: 105:2–5, 111:3 and 111:5, 113:2–5, and 109:2–6. The manuscripts
  contain 52, 60, 58, and 78 lines respectively. Arabic, QuranDB English Kanz-ul-Iman
  translations, metadata, ordering, and source completeness were verified.
- Next surah: 114, An-Naas, 6 aayaat.
- The completed 20-aayat session covered three intact surah batches: An-Naas 114:1–6,
  Al-Fatihah 1:1–7, and Al-Maun 107:1–7. Missing tafseer entries were preserved as
  standalone translation-only records: An-Naas 114:2–6, Al-Fatihah 1:7, and Al-Maun
  107:5–6. The manuscripts contain 78, 257, and 169 lines respectively. A cross-surah
  verification against QuranDB confirmed Arabic, English Kanz-ul-Iman translations,
  metadata, ordering, missing-tafseer handling, script hygiene, and line limits.
- The next eligible surah, determined from the database's sorted eligible list, was Surah
  94, Alam Nashrah, 8 aayaat (not Ad-Duha, which is Surah 93).
- The current session completed Surah 94, Alam Nashrah, 8 aayaat, in
  `manuscript/14-surah-alam-nashrah/01-surah-alam-nashrah-english-01.md`, with tafseer IDs
  54435, 54436, null, and 54437–54441. Independent QuranDB verification confirmed exact
  Arabic, English Kanz-ul-Iman translations, metadata, ordering, missing-tafseer handling,
  script hygiene, and the 256-line limit. Arabic quotations such as `اُمَّتِیْ` are rendered
  in English as “My Ummah” in the surrounding translation.
- The current session also completed Surah 95, At-Tin, 8 aayaat, in
  `manuscript/15-surah-at-tin/01-surah-at-tin-english-01.md`, with tafseer IDs
  54442, null, null, and 54443–54446, null. Independent QuranDB verification confirmed
  exact Arabic, English Kanz-ul-Iman translations, metadata, ordering, missing-tafseer
  handling, script hygiene, and the 143-line limit.
- Surah 98, Al-Bayyinah, was completed in
  `manuscript/16-surah-al-bayyinah/01-surah-al-bayyinah-english-01.md`. It contains 143 lines,
  with tafseer IDs 54459, 54460, null, and 54461–54465; Ayat 98:3 is a standalone
  translation-only entry because it has no Sirat-ul-Jinan tafseer row. Independent QuranDB
  verification confirmed exact Arabic, English Kanz-ul-Iman translations, metadata, ordering,
  missing-tafseer handling, script hygiene, and the line limit.
- Surah 99, Az-Zilzal, was completed in
  `manuscript/17-surah-az-zilzal/01-surah-az-zilzal-english-01.md`. It contains 125 lines,
  with tafseer IDs 54466, 54467, null, 54468, null, 54469, 54470, null; Ayat 99:3, 99:5,
  and 99:8 are standalone translation-only entries because they have no Sirat-ul-Jinan
  tafseer rows. Independent QuranDB verification confirmed exact Arabic, English Kanz-ul-Iman
  translations, metadata, ordering, missing-tafseer handling, script hygiene, and the line limit.
- Next eligible surah, determined from the database's sorted eligible list: 102, At-Takasur,
  8 aayaat.
- Surah 102, At-Takathur, was completed in
  `manuscript/18-surah-at-takathur/01-surah-at-takathur-english-01.md`. It contains 139 lines,
  with tafseer IDs 54479, null, and 54480 followed by null entries; Ayat 102:2 and 102:4–8 are
  standalone translation-only entries because they have no Sirat-ul-Jinan tafseer rows.
  Independent QuranDB verification confirmed exact Arabic, English Kanz-ul-Iman translations,
  metadata, ordering, missing-tafseer handling, script hygiene, and the line limit.
- Surah 104, Al-Humazah, was completed in
  `manuscript/19-surah-al-humazah/01-surah-al-humazah-english-01.md`. It contains 114 lines,
  with tafseer IDs 54482–54484 followed by null entries; Ayat 104:4–9 are standalone
  translation-only entries because they have no Sirat-ul-Jinan tafseer rows. Independent QuranDB
  verification confirmed exact Arabic, English Kanz-ul-Iman translations, metadata, ordering,
  missing-tafseer handling, script hygiene, and the line limit.
- Next eligible surah, determined from the database's sorted eligible list: 62, Al-Jumu'ah,
  11 aayaat.
- Surah 62, Al-Jumu'ah, was completed in
  `manuscript/20-surah-al-jumuah/01-surah-al-jumuah-english-01.md`. It contains 264 lines and
  all 11 aayaat. Database verification confirmed the exact Arabic, English Kanz-ul-Iman
  translations (`language_code='en'`, `trans_type='3'`), metadata, ordering, and tafseer
  coverage: tafseer IDs 54027–54036 cover 62:1–3 and 62:5–11, while 62:4 has no
  Sirat-ul-Jinan tafseer row and is preserved as a standalone `tafseerId=null` translation-only
  entry. Final review against the extracted source confirmed complete coverage and resolved the
  corrections to exact Arabic `حَاضِرًاؕ` in the preserved quotation and `Sayyiduna Abu Darda`.
- Next eligible surah, determined from the database's sorted eligible list: 63, Al-Munafiqun,
  11 aayaat.
- Surah 63, Al-Munafiqun, was completed in
  `manuscript/21-surah-al-munafiqun/01-surah-al-munafiqun-english-01.md`. It contains 206 lines
  and all 11 aayaat. Ayat 63:3 has no Sirat-ul-Jinan tafseer row and is preserved as a standalone
  `tafseerId=null` translation-only entry. Source-completeness review confirmed that all database
  aayaat and available tafseer content are present in source order. QuranDB verification confirmed
  exact Arabic, English Kanz-ul-Iman translations (`language_code='en'`, `trans_type='3'`), metadata,
  ordering, missing-tafseer handling, script hygiene, and the line limit.
- Next eligible surah, determined from the database's sorted eligible list: 93, Ad Duha,
  11 aayaat.
- Surah 93, Ad-Duha, was completed in
  `manuscript/22-surah-ad-duha/01-surah-ad-duha-english-01.md`. It contains 310 lines and
  all 11 aayaat. Ayat 93:2 has no Sirat-ul-Jinan tafseer row and is preserved as a standalone
  `tafseerId=null` translation-only entry. Source-completeness review confirmed that all
  database aayaat and available tafseer content are present in source order. QuranDB
  verification confirmed exact Arabic, English Kanz-ul-Iman translations
  (`language_code='en'`, `trans_type='3'`), metadata, ordering, missing-tafseer handling,
  script hygiene, and the line limit. Poetry review confirmed that the English renderings
  preserve the source poems' line structure, devotional tone, and poetic form.
- Next eligible surah, determined from the database's sorted eligible list: 100, Al-Adiyat,
  11 aayaat.
