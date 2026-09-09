# Islamic Knowledge — AGENTS.md

## Translation rules

Preserve Arabic script from the source exactly as-is. Do NOT romanize/transliterate Arabic terms, Quranic phrases, or Islamic terms. Keep them in the original Arabic script (e.g., المُوتَفِکَة, not al-Mu'tafika).

This preservation rule applies only to genuine Arabic text that the project requires us to retain: Quranic Arabic, Arabic duas, Arabic hadith quotations, Arabic honorifics, and other explicitly preserved Arabic quotations or terms. Urdu prose written in the Arabic-derived Urdu script is not covered by this exception and must be converted into Roman Urdu. Do not leave Urdu sentences, Urdu explanations, Urdu headings, or Urdu connective prose in script merely because they use Arabic letters.

For translated manuscripts, metadata must be written in the translated language and script style as well. In Easy Roman Urdu projects, render metadata labels and values such as lesson, chapter, sub-chapter, and source descriptions in Roman Urdu, while preserving IDs and exact Arabic source text unchanged.

### Adab for the Prophet ﷺ in translations

1. **Death reference** — Never attribute death directly to the Prophet. Use *"departed (from this world)"*, *"passed away"*, or *"was called back"*, never *"died"* or *"death of the Prophet"*.
2. **No diminishing phrasing** — Never use *"no more than"* for the Prophet. Use *"but"*, *"purely"*, or *"indeed"* (e.g., *"Muhammad is but a Messenger"*).
3. **No incapacity wording** — Never translate a divine instruction in a way that suggests the Prophet ﷺ is powerless, unable, or lacks authority, such as *"Aap un ke liye koi faisla nahin kar sakte"*. Distinguish an instruction or divinely appointed matter from incapacity. Preserve the source's precise wording, such as *"un ke liye koi dua na karein"* and *"un ka maamla Allah Ta'ala par chhor dein"*.
4. **Preserve ﷺ** — Always keep the `ﷺ` symbol after the Prophet's name wherever it appears in the source.
5. **Vocative address** — Where the Arabic has `قُلْ`, `يَا أَيُّهَا النَّبِيُّ`, or similar, render as *"Say (O Beloved)"* or *"O Prophet"*, not a bare *"Say:"*. This maintains reverent direct address.
6. **Elevated epithets** — Prefer honorific renderings consistent with Ahlus-Sunnah convention (e.g., *"Present Eyewitness (Haazir and Naazir)"* for *shahidan*, *"distinctive bondsman of Ours"* for *abdina*).
7. **Reference** — When uncertain about adab, compare against `content/books/kanzul-iman-english.json` (Kanzul Iman English) as the benchmark for appropriate reverence.
8. **Rendering of ummi** — Never translate the term *ummi* as *"unlettered"* for the final prophet. Render it as *"unschooled"*. For roman urdu, the alternative is bepadha .
9. **Anpadh** can be used for ordinary person like disbelievers .

### Roman Urdu transliteration or translation preference

When transliterating Urdu prose, use `s` rather than `th` for the ث sound where the project style calls for simplified pronunciation. Prefer `Sabit` over `Thabit`, `sawab` over `thawab`, and similar forms. Preserve Arabic script in quoted Arabic text as required below.

Do not form Roman Urdu plurals by adding the English suffix `-s` to a singular word. Use the
source's established Urdu or Arabic plural form instead, such as `aayat` / `aayaat`,
`hadees` / `ahadees`, and `mas'alah` / `masail`, rather than `aayats`, `hadeess`, or
`mas'alahs`.

## Batch translation workflow

### File size limit

All newly created or substantially changed files should contain at most 1,000 lines.
When a file would exceed this limit, split it at a logical boundary without splitting
sentences, quotations, citations, or traceable transliteration entries. Existing files
that already exceed 1,000 lines are grandfathered and do not need to be rewritten solely
to satisfy this rule.

When a book chapter is too large for a single batch file, split into sequential sub-batches. Each sub-batch should cover a logically self-contained portion of the narrative (e.g., "introduction through first major event", "second major event", "remaining story"). Always check the last sub-batch's end point before starting the next one to ensure continuity. Keep each batch focused and complete enough to verify independently. Never summarize the source. Always preserve the tone of the author.

When translating a book, always read the book's own rule files in its `notes/` directory (`publishing/<book>/notes/translation-style-guide.md`, `glossary.md`, `editorial-decisions.md`) before starting — these book-level rules take precedence over the generic rules in this file. Create/update them as translation decisions are made.

### Sirat-ul-Jinan Easy Roman Urdu workflow

The separate Easy Roman Urdu project is `publishing/siratul-jinan-easy-roman-urdu/`. Read its
`notes/translation-style-guide.md`, `glossary.md`, `editorial-decisions.md`, and
`translation-plan.md` before working on it. This project is an easy-language adaptation of the
tafseer, but its Quran translation is transliteration, not translation: use the repository QuranDB at `db/qurandb.db`,
the QuranDB `translation` table with `trans_type=2` (Kanz-ul-Irfan, Sirat), and
`tafseer.tafseertypeId=3` for Sirat-ul-Jinan. Preserve its meaning
and wording, and transliterate it into Roman Urdu. Keep that translation separate from the
Easy tafseer adaptation. Preserve Arabic Quranic text, Arabic quotations, duas, honorifics,
citations, and `ﷺ` exactly as required by the project rules. Do not fabricate Ayat 2:2, which
has no Sirat-ul-Jinan tafseer row. Keep complete production entries together in one manuscript
file until it reaches the 1,000-line limit, splitting only at entry boundaries.

When an aayat has no tafseer row, create a separate manuscript entry for that aayat. Include
only its exact Arabic from the Quran table and its `translation.trans_type=2` translation.
Do not add tafseer prose. Its metadata must explicitly use `tafseerId=null`, alongside the
`surah`, `ayat`, and `ayatId` values.

### Mirat-ul-Manajih Easy Roman Urdu workflow

The separate Easy Roman Urdu project is `publishing/mirat-ul-manajih-easy-roman-urdu/`. Before
every translation or continuation task, read its `notes/translation-style-guide.md`,
`glossary.md`, `editorial-decisions.md`, and `translation-plan.md`. The source of truth is
`db/hadees_content.db`; preserve each hadith's database metadata and keep the manuscript
traceable to its source record.

Subagents are the default workflow. One user session processes 10 hadith, divided into two
sequential sub-batches of 5. Complete and verify the first sub-batch before starting the second.
Extract the complete source records for the session into a Markdown source file and translate
only from that complete extraction, never from terminal previews, shortened output, or summaries.

This is a complete Easy Roman Urdu adaptation, not a summary. Preserve every translation,
explanation, belief, ruling, example, quotation, citation, narrator detail, and numbered note.
Preserve Arabic hadith text exactly as stored in the database, including Arabic quotations,
duas, honorifics, citations, and `ﷺ`. Keep every translation marker in its source position as
`**1**`, `**2**`, and so on. Remove only export noise such as `€`, `∞`, `¥`, `α`, stray tabs,
and obvious spacing artifacts. Verify Arabic equality, marker counts, ordering, metadata,
source coverage, Roman Urdu script hygiene, export-noise removal, and manuscript line limits
after every sub-batch. Append complete hadith boundaries to the current manuscript file and
create the next sequential file only when the next complete entry would exceed 1,000 lines.

### Manuscript File Splitting Rule

For every book manuscript, continue appending complete page or entry boundaries
to the current manuscript file across batches and sessions. Do not create a new
manuscript file merely because a batch, session, or page range is complete.
Create the next sequential file only when the current file is close to 1,000
lines and adding the next complete page or entry would exceed the limit. Never
split a page, paragraph, quotation, citation, or traceable entry solely to meet
the line limit.

### Bahar-e-Shariat Easy Roman Urdu workflow

The project is `publishing/bahar-e-shariat-easy-roman-urdu/`. Before every
translation or continuation task, read its `notes/translation-style-guide.md`,
`glossary.md`, `editorial-decisions.md`, and `translation-plan.md`. The source
of truth is `db/Bahar_e_Shariat.db`; keep each manuscript page traceable to one
SQLite source page and preserve its metadata.

This is an easy-language adaptation, not a summary. Preserve every belief,
ruling, explanation, example, quotation, citation, and page boundary. Prefer
familiar Roman Urdu. Do not introduce difficult Arabic or Persian vocabulary
merely by romanizing it; replace it with a clear meaning or add the meaning in
brackets when retaining the original term is useful. Approved examples include
`aamaal likhne wale farishte` instead of `Kiraman Katibeen`, `jhula` instead of
`gahwara`, and `apne logon` instead of `muta'alliqeen`.

One translation session means one user prompt through completion: do not stop
between batches after reporting progress. Work through up to 30 source pages,
processed as three sequential batches of 10 pages, and complete and verify each
10-page batch before starting the next. Stop only after the session's work is
complete or a genuine blocker requires clarification. This session target does not override
the manuscript file rule: append only complete pages that fit in the current
file, and continue the remaining pages in the same session in the next
sequential file only when the next complete page would exceed 1,000 lines.

Never translate from SQLite previews, shortened output, or summaries. Read the
complete source JSON records for each 10-page batch. Preserve every paragraph,
quotation, citation, footnote, example, and named detail. Compare the completed
batch against the complete source JSON page by page before starting the next
10-page batch.

Translate the complete source; do not summarize, shorten, omit, combine, or
rewrite its meaning. Preserve the author's emphasis, sequence, claims, quoted
passages, explanations, examples, citations, and footnotes. Easy Roman Urdu may
make wording clearer, but it must not replace the source's content or argument.
Preserve the source's certainty and strength. Do not weaken a definite statement
by changing it into `can`, `may`, `might`, `could`, or other uncertain wording
unless the source itself expresses possibility or permission.

For Bahar-e-Shariat Section 2 and later fiqh sections, use especially accessible
Easy Roman Urdu: explain technical terms at first use, split long source sentences,
keep legal categories and conditions distinct, and use familiar wording instead
of unnecessarily formal Arabic or Persian vocabulary. Preserve every ruling,
exception, example, quotation, citation, footnote, reward, warning, and degree of
certainty; readability must not weaken or reduce the source.

Preserve Quranic Arabic, exact hadith quotations where required, Arabic duas,
citations, honorifics, and `ﷺ`. Quranic translations from the source must keep
their wording and meaning in Roman script and must not be paraphrased. Validate
page coverage, ordering, source metadata, Arabic preservation, and accidental
Urdu or Devanagari before approval. Continue appending to the current manuscript
file across sessions; create the next file only when adding the next complete
page would exceed 1,000 lines.

Preserve quotation boundaries from the source. Use quotation marks wherever the
author quotes a sect's belief, a person's statement, a book, a hadith, or another
source, so readers can distinguish the author's narration from quoted words.
Do not turn quoted claims into unmarked narrator prose.
Write in the author's narrative voice. Do not add translator-facing phrases such
as `source ki wazahat ke mutabiq`, `the source says`, or `in this translation`
unless they are present in the source.

### Shifa Shareef Easy Roman Urdu workflow

The separate Easy Roman Urdu edition of Shifa Shareef is located at
`publishing/shifa-shareef-easy-roman-urdu/`. Before every translation, revision, or
continuation task for this project, read these files in this order:

1. `publishing/shifa-shareef-easy-roman-urdu/notes/translation-style-guide.md`
2. `publishing/shifa-shareef-easy-roman-urdu/notes/glossary.md`
3. `publishing/shifa-shareef-easy-roman-urdu/notes/editorial-decisions.md`
4. `publishing/shifa-shareef-easy-roman-urdu/manuscript/MIGRATION_STATUS.md`

The source of truth is `content/books/shifa-shareef.json`. This project is a complete
easy-language rewrite of the existing Roman Urdu source. It is not a summary, not an
English translation, and not a Devanagari transliteration. Preserve every idea,
example, quotation, reference, and fasl boundary.

- Use short sentences and familiar Roman Urdu. If a draft feels difficult, revise it
  before continuing; do not wait for the user to identify every difficult word.
- Replace difficult vocabulary with ordinary wording while keeping the exact meaning.
  Keep established Islamic, religious, and respectful terms when replacing them would
  reduce accuracy; explain a difficult term in brackets only when useful.
- Preserve Quranic Arabic, Arabic duas, Arabic hadith quotations, Arabic honorifics,
  citations, and `ﷺ` exactly as required by the source and project notes.
- Maintain adab for Huzoor ﷺ, Ambiya, Sahaba, Ahl-e-Bait, and scholars. Never use
  diminishing or irreverent wording.
- Keep one Markdown file per baab, with fasls as headings inside the baab file. Keep
  each batch below 1,000 lines and split only at a complete paragraph, quotation,
  citation, or other logical boundary.
- Before writing a new batch, inspect the last completed source page and the next
  source page. Record the printed-page range in `MIGRATION_STATUS.md`.
- After writing, compare the batch with the source JSON for coverage and ordering.
  Check for omitted content, accidental summaries, Devanagari, unwanted Urdu script,
  lost `ﷺ`, and changed Arabic quotations or references.
- Record newly approved wording decisions in the project glossary and editorial
  decisions files so the next agent can follow them.
