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

Poetry is not translated into English. It is transliterated into Roman Urdu, preserving the
original poem's line count, praise, emotional force, devotional tone, poetic architecture, radif
(repeated refrain), and qafiyah (rhyme pattern).

### Pronouns and Meaning

Poetic pronouns must be preserved according to the complete meaning, speaker, addressee, and
devotional context. Do not select pronouns by translating each isolated Urdu word. Respectful
plural verb forms may refer to one revered person; retain the intended pronoun in Roman Urdu.
