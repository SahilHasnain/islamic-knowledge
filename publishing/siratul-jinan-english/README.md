# Siratul Jinan Standard English

This project contains the standard English translation of Sirat-ul-Jinan, separate from the
Easy Roman Urdu edition.

## Surah Al-Fatihah Digital Export

The Surah Al-Fatihah export follows the Addawatul Makkiyyah digital-export convention: warm
amber theme, title page, contents, and HTML, digital PDF, EPUB, and DOCX outputs. No print-PDF
variant is produced.

Run from the repository root:

```sh
npm run export:siratul-jinan:fatihah
```

Files are written beneath `exports/` in this project. Export settings are in
`layout/export-config.json`; theme styles are in `layout/warm-amber.css`.
