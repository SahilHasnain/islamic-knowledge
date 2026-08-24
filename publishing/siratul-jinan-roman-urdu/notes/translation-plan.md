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

Within each jild, every surah gets its own folder named `<NN>-surah-<roman-name>/` (e.g., `02-surah-al-baqarah/`). Since 2026-08-22, each surah holds numbered append-only manuscript parts (`<NN>-surah-<name>-roman-01.md`, etc.) built by `scripts/consolidate_siratul_jinan_batches.py` from reviewed batches plus `_inserts/` splices. Each part is at most 2,000 lines and entries are never split between parts. Superseded per-ayat batch files are archived under the surah folder's `_archive/` directory; originals remain traceable there.

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
- `scripts/consolidate_siratul_jinan_batches.py`: merge reviewed batches into the single per-surah manuscript; verifies ayat ordering and every `(ayat → tafseerId)` pair against the DB; splices `_inserts/` entries.
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

Progress: Batches 1–96 (Al-Baqarah 2:1 through 2:131, excluding the three late-added cross-reference entries) are transliterated and consolidated into numbered manuscript parts `02-surah-al-baqarah/02-surah-al-baqarah-roman-01.md` and `02-surah-al-baqarah-roman-02.md` (130 entries; each part is at most 2,000 lines; both pass `validate_siratul_jinan_translation.py`). The three DB rows skipped by early extraction — 2:36 (tafseerId 54507), 2:39 (54508), and 2:46 (54509), all one-line "covered under previous ayat" cross-references — were transliterated with the Batch 24 precedent wording and spliced in via `_inserts/`. Ayat 2:2 has no source tafseer row. Coverage is complete for ayats 1–131 (130/130 DB rows matched). Originals are archived under `_archive/batches-01-82/`, `_archive/batches-83-85/`, `_archive/batches-86/`, `_archive/batches-87-91/`, and `_archive/batches-92-96/`. Next: Al-Baqarah 2:132 (tafseerId 54513). Note: tafseerIds are non-monotonic — verify ordering by ayat number via the `aayaat` join, never by tafseerId.

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
