# Fatawa Razaviya Easy Roman Urdu Editorial Decisions

## Project Boundary

This is a complete easy-language adaptation of Fatawa Razaviya. It is separate from the
literal Roman Urdu project and must preserve the source's complete meaning and structure.

## Database Authority

The authoritative database is the project copy at:

`db/fatawa_e_razvia.db`

The `hadith` table is a legacy table name. Its `without_araab` field contains the main Urdu
source text, and `avidance` contains many source references. The stable extraction identity is
the volume, lesson, chapter or sub-chapter metadata, and SQLite row order.

## Pilot

The pilot begins with volume `Jild-1-Part-1`, lesson `472`, titled `سند الفقیر فی الفقہ المنیر
مسلسلا بالحنفیۃ الکرام و المفتین و المصنّفین و المشائخ الاعلام`. It contains 5 records and
approximately 6,796 Urdu characters. It is a short, self-contained section suitable for
approving adaptation style and traceability before beginning longer رسائل.

## Approved Spelling Preferences

- Use `unhone` and `inhone`, not `unhon ne` or `inhon ne`.
- Use `mana`, not `manaahi`.
- Use `Ambiya`, not `Anbiya`.

## Script Decision

The reader-facing manuscript should be predominantly Roman Urdu. Arabic script is retained
only where the exact wording is necessary, such as Quranic verses, complete hadith quotations,
duas, and essential devotional symbols such as `ﷺ`. Ordinary Arabic vocabulary, scholarly
names and titles, sanad chains, footnotes, and book titles should be written in Roman Urdu when
the pronunciation is clear. The extracted JSON remains the exact-script source record.

Arabic honorifics such as `رضی الله تعالی عنہ` remain in Arabic in the reader-facing manuscript,
along with `ﷺ`.

This approach was approved after review of the lesson 472 pilot. Future batches should follow
the same readability standard.
