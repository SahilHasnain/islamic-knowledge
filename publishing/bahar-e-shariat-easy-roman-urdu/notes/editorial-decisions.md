# Bahar-e-Shariat Easy Roman Urdu Editorial Decisions

## Source Authority

The source of truth is `db/Bahar_e_Shariat.db`. The main text is stored in
`volume_one`, `volume_two`, and `volume_three`, with `page_number` as the source
record key. Supporting Quran, hadith, dictionary, and definition tables remain
available for verification.

## SQLite-Ready Manuscript

Each manuscript entry maps to exactly one source page. Source metadata must be
explicitly recorded so the manuscript can be compiled into SQLite without
inferring identity from headings or filenames.

## Readability

The reader-facing text is predominantly Roman Urdu. Arabic is retained only for
exact Quranic or hadith wording and essential honorifics. Ordinary Arabic and
Persian vocabulary is romanized when pronunciation is clear.

Source-fidelity rule: when the Urdu source is already easy and clear, preserve
its wording closely. Adaptation should only improve genuine readability barriers,
not replace clear wording with unnecessary paraphrase or modern language.

Quranic translation rule: the source's Quranic translations must be preserved
word-for-word in Roman script. They are transliterations of the source, not Easy
Roman Urdu adaptations. Do not translate, paraphrase, simplify, reorder, omit,
or replace any source words. Only script, spacing, and punctuation may change.
Every Quranic translation must be checked against its source page before approval.

The pages 4–6 pilot was approved. Future batches must retain one manuscript entry
per SQLite source page with explicit source metadata.

For aqeedah wording, preserve the source’s adab when discussing Muhaal: do not say
that Allah (عزوجل) lacks power over it. Say that Muhaal is not a subject of Qudrat
because it cannot exist by its own nature, while affirming Allah’s perfect Qudrat
over every mumkin.

## Approved Easy-Wording Decisions

- Use `jhula` instead of `gahwara` for `گہوارہ`.
- Use `in se jure hue sab logon` instead of `mutawassileen`.
- Explain `Illiyyeen` as `Illiyyeen (bahut buland aur ba-izzat maqam)`.
- Explain `qafas` as `qafas (pinjre)`.
- Use `seedhi` instead of `hamwar`.
- Use `koore ka agla hissa` instead of `chabuk ka sirah`.
- Romanize `صلیب` as `Saleeb` and retain `khinzeer` for `خنزیر`.
- Use `qabr ke azaab aur aaraam` instead of `Azaab-o-Tan'eem-e-Qabr`.
- Use `apne logon` instead of `muta'alliqeen`.
- Render the vocative `يا محمد` as `Aye Muhammad ﷺ`.
- Use `baligh hone se pehle` instead of the difficult word `bulugh se pehle`.
- Retain `taqleed` and explain it on first use as `sirf kisi alim ki baat maan lena (taqleed) kaafi nahi hota`; avoid the potentially misleading phrase `blind following`.
- Do not introduce difficult religious titles merely by romanizing them. Use an easy meaning in reader-facing prose, such as `aamaal likhne wale farishte` for `Kiraman Katibeen`.
- Explain `gaarah` on first use as `gaarah (eenton ko jorne wala lep)`.
- Replace difficult `Qashqah lagana` with `maathe par tilak lagana`.
- When `is bade Dajjal` appears before the major Dajjal has been introduced in context, write `ek bade Dajjal` for clarity without changing the meaning.
- A manuscript page must not be compressed into a summary. Preserve every source quotation, argument, example, citation, and named detail, even when the page requires a longer entry or a separate continuation session.
- Source records must be read in full. Shortened SQLite previews are for orientation only and must never be used as the translation source. Each 10-page batch requires a page-by-page content comparison before the next batch begins.
- The manuscript is a complete translation/adaptation, never a summary. Do not omit, compress, combine, or alter source content, meaning, order, emphasis, quoted passages, explanations, examples, citations, or footnotes. Easy wording changes prose only; they must not remove the author's argument or details.
- Preserve modality exactly. A definite source claim must remain definite; do not weaken it with `can`, `may`, `might`, or `could` unless the source expresses possibility or permission.
- Preserve source quotation boundaries. Quoted sectarian beliefs, personal statements, book passages, hadith, and cited material must remain visibly quoted in Roman Urdu; never present a quoted claim as unmarked narrator prose.
- Keep the author's narrative voice. Do not insert translator commentary such as `source ki wazahat ke mutabiq` or `the source says`.

## Section 2 Fiqh Readability

- Section 2 requires a stronger Easy Roman Urdu adaptation than the earlier
  aqeedah section. Use short sentences, familiar words, and first-use explanations
  for technical fiqh terms.
- Preserve every legal category, condition, exception, example, quotation,
  citation, footnote, reward, warning, and degree of certainty. Simplifying the
  language must never simplify away the ruling.
- Keep Farz, Wajib, Sunnat, Mustahab, Mubah, Haram, and Makrooh definitions
  visibly distinct and state their practical effects plainly.
