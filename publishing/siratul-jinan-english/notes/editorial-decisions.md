# Sirat-ul-Jinan Standard English Editorial Decisions

## Project Boundary

This is a separate standard English translation project. It must not alter the Easy Roman Urdu
or literal Roman Urdu projects.

## Source Authority

- Use `db/qurandb.db` as the authoritative source for Arabic, identifiers, ordering, and Sirat-ul-
  Jinan tafseer rows (`tafseertypeId=3`).
- Use the complete source text from the database, removing export HTML only.
- Use QuranDB's English Kanz-ul-Iman translation, identified by `language_code='en'` and
  `trans_type='3'`. The English Kanz-ul-Irfan row (`trans_type='8'`) is not the source for this
  project.

## Missing Tafseer

When an aayat has no Sirat-ul-Jinan tafseer row, create a separate entry containing only its
exact Arabic and the approved English Quran translation. Its metadata must explicitly contain
`tafseerId=null`, `surah`, `ayat`, and `ayatId`.

## Ordering

Eligible surahs are processed by increasing number of aayaat, with surah number as the tie-breaker.

## Poetry

Poetry is translated as poetry in standard English rather than flattened into prose. The
translation should preserve the original poem's line count, praise, emotional force, devotional
tone, and poetic architecture. Where present, the English rendering must consciously reproduce
the source's radif (repeated refrain) and qafiyah (rhyme pattern), or use an equally consistent
English refrain and rhyme scheme when the original sounds cannot be carried over literally.
