# Sirat-ul-Jinan Source Structure

## Database

`source/siratul-jinan.db` is built from the live-quran reference databases by `scripts/build_siratul_jinan_db.py`.

## Tables

- `surah`: 114 surahs and metadata.
- `para`: 30 paras and starting boundaries.
- `aayaat`: Quranic ayat mapping, Arabic text, surah, and para identifiers.
- `tafseer`: 4,376 Sirat-ul-Jinan entries, linked through `ayatId`; includes raw HTML and cleaned plain text.
- `headings`: 3,513 printed-book headings with volume, page, para, surah, and ayat references.

## Translation Query Order

Use this order for extraction:

```text
headings / volume
  -> para
    -> surah
      -> ayat
        -> tafseerId
```

The `tafseerTextPlain` column is the translation input. The raw `tafseerText` column is retained for source verification and regeneration.
