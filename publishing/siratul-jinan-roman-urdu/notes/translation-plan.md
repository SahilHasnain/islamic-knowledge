# Sirat-ul-Jinan Roman Urdu Transliteration Plan

## 1. Objective

Transliterate the Urdu tafseer of *Sirat-ul-Jinan fi Tafseer-il-Quran* from Urdu script into clear, consistent Roman script, producing readable Roman Urdu that mirrors the source exactly.

**This is transliteration, not translation.** The Urdu vocabulary, grammar, sentence order, and meaning are preserved exactly; only the script changes. Do not paraphrase, reword into English, or "translate" the meaning. Quranic Arabic, Arabic duas, hadith quotations, Islamic phrases, and Arabic honorifics are never romanized — they remain in Arabic script exactly as in the source.

The SQLite database is the source of truth. Manuscript files are the reviewed publishing output generated from database-backed transliteration batches.

## 2. Source Scope

Source database:

`publishing/siratul-jinan-roman-urdu/source/siratul-jinan.db`

Current source inventory:

- 10 volumes
- 30 paras
- 114 surahs
- 6,350 Quranic ayat records
- 4,376 Sirat-ul-Jinan tafseer entries
- Approximately 8.5 million Urdu characters in cleaned tafseer text
- Raw HTML and cleaned plain text retained in the `tafseer` table

The source database contains these core tables:

- `surah`: surah names and metadata
- `para`: para boundaries and metadata
- `aayaat`: ayat identifiers, Arabic text, and Quranic mapping
- `tafseer`: Sirat-ul-Jinan tafseer linked to `ayatId`

Every transliterated entry must remain traceable to its `tafseerId`, `ayatId`, surah, ayat number, para, and volume.

## 3. Book Organization

The translated manuscript will follow the ten-volume structure:

| Volume | Paras |
|---|---|
| Jild 1 | 1–3 |
| Jild 2 | 4–6 |
| Jild 3 | 7–9 |
| Jild 4 | 10–12 |
| Jild 5 | 13–15 |
| Jild 6 | 16–18 |
| Jild 7 | 19–21 |
| Jild 8 | 22–24 |
| Jild 9 | 25–27 |
| Jild 10 | 28–30 |

Proposed manuscript structure:

```text
publishing/siratul-jinan-roman-urdu/
  source/
    siratul-jinan.db
  manuscript/
    00-pilot/
    01-jild-awwal/
      01-surah-al-fatihah/      (future; pilot batches live in 00-pilot/)
      02-surah-al-baqarah/
      03-surah-al-imran/        (future)
      04-surah-an-nisa/         (future)
      ...
    02-jild-doyam/
      03-surah-al-imran/        (continues)
      ...
    03-jild-soyam/
    ...
    10-jild-dahum/
  notes/
  layout/
  exports/
```

Within each jild, every surah gets its own folder named `<NN>-surah-<roman-name>/` (e.g., `02-surah-al-baqarah/`). The batch files keep their global batch-sequence prefix and surah in the filename (e.g., `02-surah-al-baqarah/11-surah-al-baqarah-aayaat-33-34-roman.md`); the batch number is the volume-wide sequence, the folder is the surah grouping.

Within each volume, content should be ordered by para, surah, and ayat.

## 4. Transliteration Principles

- Convert Urdu script to Roman script following the project's romanization scheme; record approved spellings in `notes/glossary.md`.
- This is script conversion, not translation. Keep the author's exact words, order, and tone. Do not summarize, omit, silently combine, or reword passages.
- Preserve Quranic Arabic exactly in Arabic script.
- Preserve Arabic duas, hadith quotations, invocations, and established Arabic phrases in Arabic script. Never romanize them.
- Preserve `ﷺ` and all prophetic, Companion, scholar, and saintly honorifics.
- Preserve references to books, hadith collections, volumes, pages, and ayat numbers.
- Preserve numbered discussions, headings, quotations, and source citations.
- In `{Arabic phrase: Urdu meaning}` blocks, keep the Arabic phrase in Arabic script and convert only the Urdu meaning to Roman script.
- Use respectful Ahlus-Sunnah terminology for Allah, the Prophets, the Companions, and the righteous.
- Record recurring romanized spellings and difficult decisions in the project glossary and editorial decisions file.

## 5. Source Entry Format

Each transliteration unit should retain source identity in a small metadata block or an adjacent batch manifest. The published manuscript itself should remain readable and should not expose unnecessary database implementation details.

Recommended working format:

```md
## Surah Al-Fatihah — Ayat 1:1

**Arabic:** اَلْحَمْدُ لِلّٰهِ

**Roman Urdu (transliteration):** Sab tareefain Allah Ta'ala ke liye hain.

Yani har qisam ki hamd aur tareef ka mustahiq Allah Ta'ala hai...

`Source: tafseerId=50140; ayatId=2`
```

The exact published format will be finalized after the pilot batch. Source IDs may remain in batch files and validation manifests even if they are removed from the final reader-facing export.

## 6. Special Source Handling

The database contains HTML-formatted Urdu in `tafseerText` and cleaned text in `tafseerTextPlain`.

- Use `tafseerTextPlain` for transliteration work.
- Keep `tafseerText` for source fidelity and regeneration.
- Preserve paragraph breaks and `{Arabic phrase: Urdu meaning}` blocks.
- Treat braces as structured units: preserve the Arabic phrase and convert only the Urdu meaning to Roman script.
- Keep numbered references such as `(1)…` intact.
- Do not convert HTML tags, font names, CSS, or database formatting artifacts.
- Before generating batches, validate that extraction has not introduced literal replacement markers such as `($1)`.

## 7. Batch Strategy

The complete work is too large for chapter-sized sessions. Batches will be generated from SQLite by semantic and length boundaries.

### Pilot batch

Start with Surah Al-Fatihah:

- Confirm Arabic preservation.
- Confirm handling of `{...}` phrase blocks.
- Establish romanization and honorific conventions.
- Establish citation and footnote formatting.
- Establish paragraph and heading style.
- Review the complete pilot before scaling.

### Standard batches

After the pilot, use batches of approximately 2,000–4,000 Urdu characters, adjusted for complexity:

- Short entries: 3–8 entries
- Normal entries: 2–5 entries
- Long entries: 1–2 entries

Never split a sentence, quotation, numbered discussion, or citation across batches unless the source itself requires it.

Each batch must have:

- A sequential batch filename
- Volume and para
- Surah and ayat range
- `tafseerId` and `ayatId` range
- Source character count
- Transliteration status
- Review status
- Notes on unresolved terms or editorial decisions

## 8. Workflow Per Batch

1. Query the SQLite database for the next approved source range.
2. Generate a source batch containing Urdu text, Arabic text, identifiers, and boundaries.
3. Read the preceding batch's ending and the next batch's beginning for continuity.
4. Transliterate the batch from Urdu script to Roman script without summarizing or paraphrasing.
5. Preserve Arabic script, honorifics, citations, headings, and numbered references.
6. Compare the transliteration against the Urdu source line by line.
7. Run automated validation for IDs, missing content, Arabic preservation, and forbidden leftovers.
8. Record romanization decisions in the glossary and editorial decisions files.
9. Mark the batch `transliterated`, `self-reviewed`, or `approved`.
10. Do not begin the next dependent batch until continuity is confirmed.

## 9. Status Tracking

Use these statuses in `notes/batch-register.md`:

```text
pending
extracted
transliterated
self-reviewed
editorially-reviewed
approved
exported
```

The batch register should be the authoritative progress tracker. A volume is complete only when every batch is `approved`.

## 10. Required Supporting Files and Tools

### Project notes

- `notes/translation-style-guide.md`
- `notes/glossary.md`
- `notes/editorial-decisions.md`
- `notes/source-structure.md`
- `notes/batch-register.md`

### Scripts

- `scripts/build_siratul_jinan_db.py`: regenerate the focused SQLite source.
- `scripts/extract_siratul_jinan_batch.py`: generate transliteration batches by volume, para, surah, ayat, or source ID.
- `scripts/validate_siratul_jinan_translation.py`: validate coverage, identifiers, Arabic preservation, and formatting.
- `scripts/export_siratul_jinan_roman_urdu.mjs`: generate HTML, digital PDF, print PDF, EPUB, and DOCX after approval.

## 11. Quality Assurance

### Source integrity

- Every transliterated entry maps to exactly one `tafseerId` and `ayatId`.
- No approved source entry is skipped or duplicated.
- Surah, para, and ayat ordering matches the database.
- Arabic ayat text is unchanged.
- Source headings and citations are retained.

### Language review

- Roman Urdu is readable and consistent.
- The Roman script mirrors the Urdu source word for word; no meaning was paraphrased or compressed.
- Urdu script does not remain accidentally in Roman Urdu prose.
- Arabic script remains where required.
- Names, titles, places, books, and hadith references are consistent.
- Allah-related and prophetic wording follows the project's adab rules.

### Publication review

- No unresolved placeholders remain.
- No literal HTML or extraction artifacts remain.
- Footnotes and references render correctly.
- Section headings and page order are correct.
- Exported HTML, PDF, EPUB, and DOCX are visually inspected before release.

## 12. Milestones

### Milestone 1 — Foundation

- Finalize source extraction rules.
- Fix and test numbered-reference extraction.
- Add source structure and heading mapping.
- Create project metadata and notes.
- Generate the Al-Fatihah pilot.

### Milestone 2 — Pilot approval ✅

- Transliterate Al-Fatihah. ✅
- Review it against the Urdu source. ✅
- Finalize the Roman script style, Arabic handling, and citation conventions. ✅
- Freeze the first version of the glossary. ✅
- Pilot approved; scaling may begin (Milestone 3 — Jild 1, Paras 1–3).

### Milestone 3 — Jild 1

- Transliterate Paras 1–3.
- Review each batch.
- Complete a volume-level consistency review.
- Export a review copy only after all Jild 1 batches are approved.

Progress: Batches 1–10 (Al-Baqarah 2:1, 2:3, 2:4–2:7, 2:8–2:10, 2:11–2:13, 2:14–2:17, 2:18–2:22, 2:23–2:25, 2:26–2:29, 2:30–2:32) approved. Batches 11–13 (Al-Baqarah 2:33–2:34, 2:35, 2:37–2:38) approved. Batches 14–16 (Al-Baqarah 2:40, 2:41, 2:42–2:43) approved. Batches 17–19 (Al-Baqarah 2:44, 2:45, 2:47) approved. Batches 20–24 (Al-Baqarah 2:48, 2:49, 2:50, 2:51, 2:52) approved. Batches 25–29 (Al-Baqarah 2:53, 2:54, 2:55, 2:56, 2:57) approved. Batches 30–34 (Al-Baqarah 2:58, 2:59, 2:60, 2:61, 2:62) approved. Batches 35–39 (Al-Baqarah 2:63, 2:64, 2:65, 2:66, 2:67) approved. Batches 40–44 (Al-Baqarah 2:68, 2:69, 2:70, 2:71, 2:72) approved. Batches 45–49 (Al-Baqarah 2:73, 2:74, 2:75, 2:76, 2:77) approved. Batches 50–56 (Al-Baqarah 2:78, 2:79, 2:80, 2:81, 2:82, 2:83, 2:84) approved. Subsequent batches are processed in sets (seven per session). Batches 57–63 (Al-Baqarah 2:85, 2:86, 2:87, 2:88, 2:89, 2:90, 2:91) approved. Batches 64–70 (Al-Baqarah 2:92, 2:93, 2:94, 2:95, 2:96, 2:97, 2:98) self-reviewed; pending approval. Batches 71–77 (Al-Baqarah 2:99, 2:100, 2:101, 2:102, 2:103, 2:104, 2:105) transliterated and self-reviewed; pending approval. Next: Al-Baqarah 2:106 onward, seven batches per session. (Note: no tafseer entries exist for 2:36, 2:39, 2:46 in this para/volume.)

### Milestone 4 — Jilds 2–5

- Continue in three-para volumes.
- Review terminology against the approved Jild 1 conventions.
- Perform a cross-volume review after Jild 5.

### Milestone 5 — Jilds 6–10

- Complete the remaining paras.
- Perform final Quranic, theological, citation, and terminology review.
- Generate final exports.

## 13. Definition of Done

The transliteration project is ready for publication when:

- All 4,376 source tafseer entries have an approved Roman Urdu counterpart.
- All source IDs and ordering have been validated.
- All Arabic text and honorifics have passed preservation checks.
- The glossary and editorial decisions are complete.
- Every volume has passed a consistency review.
- HTML, PDF, EPUB, and DOCX exports have been generated and inspected.
- Metadata status is changed from draft only after final approval.

## 14. Immediate Next Steps

1. Fix and test the batch extraction cleanup, especially numbered references.
2. Incorporate the Sirat-ul-Jinan heading and volume mapping from the sibling database.
3. Create the project style guide, glossary, editorial decisions, and batch register.
4. Generate the complete Surah Al-Fatihah pilot batch.
5. Transliterate and review the pilot before beginning Para 1 at scale.
