# Ikhteyarate Mustafa mobile database

Build the SQLite database from the authoritative Roman Urdu JSON and the existing Hindi and English manuscripts:

```sh
python publishing/ikhteyarate-mustafa-english/tools/build_mobile_database.py
```

The generated file is `publishing/ikhteyarate-mustafa-english/database/ikhteyarate-mustafa-mobile.db`.

## Schema

- `book`: book identity and source page count.
- `editions`: Roman Urdu, Hindi, and English edition identity, language, display title, status, and source path.
- `sections`: ordered edition-specific content with a stable section slug, title, Markdown/plain-text format, source section mapping, and source/printed page ranges.

Each edition includes an ordinal-0 front-matter row followed by its section content. Roman Urdu and Hindi use the 16 source section boundaries. English text is split at its existing manuscript headings and mapped in order to those same 16 source sections; the English manuscript's grouped chapter files remain its content source.

To read sections in order:

```sql
SELECT s.ordinal, s.slug, s.title, s.content
FROM sections AS s
JOIN editions AS e USING (edition_id)
WHERE e.edition_key = 'roman-urdu'
ORDER BY s.ordinal;
```
