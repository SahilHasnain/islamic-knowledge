# Translation Plan

## Source

Database: `db/hadees_content.db`  
Book: `مرآۃ المناجیح شرح مشکوٰۃ المصابیح` (`book_id=1`)  
Range: Volume 1 (`volume_id=1`), Hadith 1-110

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

Hadith 61-65 is complete in sequential manuscript file 02. Batch 08 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly. The five source rows have IDs 132, 135, 142, 145, and 147.

Hadith 66-70 is complete in sequential manuscript file 02. Batch 09 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly. The five source rows have IDs 148, 149, 150, 151, and 152.

Hadith 71-75 is complete in sequential manuscript file 02. Batch 10 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly. The five source rows have IDs 153, 154, 183, 184, and 185.

Hadith 76-80 is complete in sequential manuscript file 02. Batch 11 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly. The five source rows have IDs 186, 187, 188, 202, and 205.

Hadith 81-85 is complete in sequential manuscript file 02. Batch 12 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly. The five source rows have IDs 208, 210, 212, 214, and 215.

Hadith 86-90 is complete across sequential manuscript files 02 and 03. Batch 13 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly. Hadith 86-89 are in file 02 and Hadith 90 begins file 03 at a complete boundary. The five source rows have IDs 217, 218, 219, 221, and 222.

Hadith 91-95 is complete in sequential manuscript file 03. Batch 14 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly. The five source rows have IDs 223, 3396, 229, 232, and 234.

Hadith 96-100 is complete in sequential manuscript file 03. Batch 15 was verified against complete database records ordered with `CAST(c7hadith_no AS INTEGER)`; Arabic hadith fields matched the database exactly. The five source rows have IDs 235, 237, 238, 240, and 243.

Correction recorded: Hadith 91-100 Lafzi tarjuma sections were rechecked against complete `c12translation` fields and source numbered markers were restored in place without changing the literal Roman Urdu wording. Markers must be preserved and never renumbered.

Hadith 101-105 is complete in the primary session without subagents. Arabic hadith fields and translation footnote numbering were preserved from the database.

Hadith 106-110 is complete in the primary session without subagents. Arabic hadith fields, complete explanations, and translation footnote numbering were preserved from the database. The manuscript remains below 1,000 lines.

Hadith 111-120 is complete in the primary session without subagents. The complete source records were extracted to `mirat-111-120-source.md` before translation. Arabic hadith fields, complete explanations, and translation footnote numbering were verified against the database. The manuscript remains below 1,000 lines.

## Next Range

Continue with Hadith 121 in the current volume, appending complete entries to manuscript file 03 until the next complete entry would exceed 1,000 lines.
