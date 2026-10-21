# Addawatul Makkiyyah Mobile Database

Database: `addawatul-makkiyyah-mobile.db`

The database provides two versions under one shared section-oriented schema:

- **Roman Urdu:** one front-matter entry followed by the 71 named sections from the source JSON.
  Section content is assembled from its complete nested page records; page text and printed-page
  labels remain in that content, with JSON/printed page ranges available as fields.
- **English:** the 15 translated sections currently in the independent English manuscript. The
  edition status is `in progress` because the translation is not complete yet.

The unrelated pre-existing English project is not used to build the English version.

## Schema

- `book`: slug, title, author.
- `editions`: `Roman Urdu` and `English`, their status, and ordering.
- `sections`: edition ID, section order, slug, title, source JSON-page range, printed-page range,
  content format (`text` for Roman Urdu, `markdown` for English), and section content.

## Example Queries

```sql
SELECT edition_id, name, status
FROM editions
ORDER BY sort_order;

SELECT sort_order, title, printed_page_start, printed_page_end, content
FROM sections
WHERE edition_id = :roman_urdu_edition_id
ORDER BY sort_order;

SELECT sort_order, title, json_page_start, json_page_end, content
FROM sections
WHERE edition_id = :english_edition_id
ORDER BY sort_order;
```

## Rebuild

Run from the repository root:

```sh
python -X utf8 publishing/addawatul-makkiyyah-english-json/tools/build_mobile_database.py
```
