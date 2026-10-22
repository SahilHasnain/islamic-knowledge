# Sirat-ul-Jinan Roman Urdu

Database-backed Roman Urdu transliteration of *Sirat-ul-Jinan fi Tafseer-il-Quran*: the Urdu script is converted into Roman script while preserving the Urdu vocabulary, grammar, and sentence order exactly. This is transliteration, not meaning-based translation. Quranic Arabic, Arabic duas, hadith quotations, Islamic phrases, and Arabic honorifics stay in Arabic script.

## Source

The source of truth is `source/siratul-jinan.db`. Rebuild it with:

```bash
python scripts/build_siratul_jinan_db.py
```

## Translation Plan

Read `notes/translation-plan.md` before starting transliteration work. The Surah Al-Fatihah pilot must be approved before full-volume work begins.

## Project Notes

- `notes/translation-style-guide.md`: transliteration, romanization, and adab rules
- `notes/glossary.md`: approved Urdu → Roman spellings
- `notes/editorial-decisions.md`: project decisions
- `notes/source-structure.md`: SQLite schema and source mapping
- `notes/batch-register.md`: transliteration progress
