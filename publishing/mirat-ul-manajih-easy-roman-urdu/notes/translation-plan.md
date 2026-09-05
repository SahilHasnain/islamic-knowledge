# Translation Plan

## Source

Database: `db/hadees_content.db`  
Book: `مرآۃ المناجیح شرح مشکوٰۃ المصابیح` (`book_id=1`)  
Range: Volume 1 (`volume_id=1`), Hadith 1-60

## Method

1. Read complete database records, not previews or SQLite row order.
2. Keep Arabic hadith text byte-for-character equivalent at the content level.
3. Transliterate the Urdu translation literally into Roman Urdu.
4. Adapt every explanatory paragraph and numbered note into easy Roman Urdu.
5. Verify IDs, ordering, Arabic equality, coverage, script hygiene, export-noise removal, and Markdown whitespace.

## Completed Range

Hadith 1-20 is complete in the same manuscript. Batch 02 covers Hadith 11-20 and was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`.

Hadith 21-30 is complete in the same manuscript. Batch 03 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`.

Hadith 31-40 is complete in the same manuscript. Batch 04 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly.

Hadith 41-45 is complete in sequential manuscript file 02. Batch 05 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly.

Hadith 46-50 is complete in sequential manuscript file 02. Batch 06 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly.

Hadith 51-60 is complete in sequential manuscript file 02. Batch 07 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly. The ten source rows have IDs 112, 115, 3228, 123, 124, 126, 127, 129, 130, and 131.

## Next Range

Continue with Hadith 61 in the current volume, appending complete entries to manuscript file 02 until the next complete entry would exceed 1,000 lines.
