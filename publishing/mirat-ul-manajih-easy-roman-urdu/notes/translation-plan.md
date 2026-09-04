# Translation Plan

## Source

Database: `db/hadees_content.db`  
Book: `مرآۃ المناجیح شرح مشکوٰۃ المصابیح` (`book_id=1`)  
Range: Volume 1 (`volume_id=1`), Hadith 1-20

## Method

1. Read complete database records, not previews or SQLite row order.
2. Keep Arabic hadith text byte-for-character equivalent at the content level.
3. Transliterate the Urdu translation literally into Roman Urdu.
4. Adapt every explanatory paragraph and numbered note into easy Roman Urdu.
5. Verify IDs, ordering, Arabic equality, coverage, script hygiene, export-noise removal, and Markdown whitespace.

## Completed Range

Hadith 1-20 is complete in the same manuscript. Batch 02 covers Hadith 11-20 and was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`.

## Next Range

Continue with Hadith 21 in the same manuscript until adding a complete entry would exceed 1,000 lines.
