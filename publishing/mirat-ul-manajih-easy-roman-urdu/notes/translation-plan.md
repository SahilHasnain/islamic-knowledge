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

Hadith 121-130 is complete in the primary session without subagents. The complete source records were extracted to `mirat-121-130-source.md` before translation. Translation markers, source coverage, manuscript boundaries, and export-noise checks were verified. Hadith 123-124 Arabic fields match the database exactly; Hadith 129-130 retain the complete Arabic content but require a final byte-level spacing and vowel-mark reconciliation before the range can be marked fully Arabic-verified. The manuscript remains below 1,000 lines.

Hadith 131-140 is complete in the primary session without subagents. The complete source records were extracted to `mirat-131-140-source.md` before translation. Arabic hadith fields, all translation markers, source coverage, manuscript boundaries, and export-noise checks were verified against the database. The new manuscript file remains below 1,000 lines.

Hadith 141-150 is complete in the primary session without subagents. The complete source records were extracted to `mirat-141-150-source.md` before translation. Arabic hadith fields, all translation markers, source coverage, Roman Urdu metadata, manuscript boundaries, and export-noise checks were verified against the database. The manuscript file remains below 1,000 lines. From this batch onward, manuscript metadata is rendered in Roman Urdu while IDs and exact Arabic source text remain unchanged.

Hadith 151-160 is complete in the standard workflow using two verified sub-batches of five. The complete source records were extracted to `mirat-151-160-source.md` before translation. Arabic hadith fields, source metadata, translation markers, full source coverage, script hygiene, export-noise checks, and Markdown whitespace were verified against the database. The manuscript file remains below 1,000 lines.

Hadith 161-165 is complete as the first verified sub-batch of the standard 10-hadith session. The complete source records were extracted to `mirat-161-170-source.md` before translation. Arabic hadith fields, source metadata, translation markers, full source coverage, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript file remains below 1,000 lines.

Hadith 166-170 is complete as the second verified sub-batch of the standard 10-hadith session. The complete source records were translated from `mirat-161-170-source.md`. Arabic hadith fields, source metadata, translation markers, full source coverage, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript file remains below 1,000 lines.

Hadith 171-175 is complete as the first verified sub-batch of the standard 10-hadith session. The complete source records were extracted to `mirat-171-180-source.md` before translation. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript file remains below 1,000 lines.

Hadith 176-180 is complete as the second verified sub-batch of the standard 10-hadith session. The complete source records were translated from `mirat-171-180-source.md`. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript file remains below 1,000 lines.

Hadith 181-190 is complete as a standard 10-hadith session in two verified sub-batches of five. The complete source records were extracted to `mirat-181-190-source.md` before translation. Hadith 181-185 were already complete; Hadith 186-190 were appended to manuscript file 05. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript remains below 1,000 lines.

Hadith 191-195 is complete as the first verified sub-batch of the standard 10-hadith session. The complete source records were extracted to `mirat-191-200-source.md` before translation. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript remains below 1,000 lines.

Hadith 196-200 is complete as the second verified sub-batch of the standard 10-hadith session. The complete source records were translated from `mirat-191-200-source.md`. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript remains below 1,000 lines at 345 lines.

Hadith 201-210 is complete as a standard 10-hadith session in two verified sub-batches of five. The complete source records were extracted to `mirat-201-210-source.md` before translation. Hadith 201-205 were already complete; Hadith 206-210 were appended to manuscript file 05. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript remains below 1,000 lines.

Hadith 211-220 is complete as a standard 10-hadith session in two verified sub-batches of five. The complete source records were extracted to `mirat-211-220-source.md` before translation. Hadith 211-215 were already complete; Hadith 216-220 were appended to manuscript file 05. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript remains below 1,000 lines.

Hadith 221-225 is complete as the first verified sub-batch of the standard 10-hadith session. The complete source records were extracted to `mirat-221-230-source.md` before translation. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript remains below 1,000 lines at 840 lines.

Hadith 226-230 is complete as the second verified sub-batch of the standard 10-hadith session. The complete source records were translated from `mirat-221-230-source.md`. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript remains below 1,000 lines at 922 lines.

Hadith 231-235 is complete as the first verified sub-batch of the standard 10-hadith session. The complete source records were extracted to `mirat-231-240-source.md` before translation. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. Hadith 231-235 remain in manuscript file 05, which reached 994 lines.

Hadith 236-240 is complete as the second verified sub-batch of the standard 10-hadith session. The complete source records were translated from `mirat-231-240-source.md`. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the complete-hadith manuscript boundary were verified against the database. Hadith 236-240 begin manuscript file 06.

Hadith 241-245 is complete as the first verified sub-batch of the standard 10-hadith session. The complete source records were translated from `mirat-241-250-source.md`. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the manuscript boundary were verified against the database. The manuscript remains below 1,000 lines.

Hadith 246-250 is complete as the second verified sub-batch of the standard 10-hadith session. The complete source records were translated from `mirat-241-250-source.md`. Arabic hadith fields, source metadata, translation markers, full explanations, script hygiene, export-noise checks, and the complete-hadith manuscript boundary were verified against the database. Hadith 246-250 continue in manuscript file 06, which remains below 1,000 lines.

## Next Range

Hadith 241-250 is complete. Continue with Hadith 251 in the current volume, appending complete entries to manuscript file 06 until the next complete entry would exceed 1,000 lines.
