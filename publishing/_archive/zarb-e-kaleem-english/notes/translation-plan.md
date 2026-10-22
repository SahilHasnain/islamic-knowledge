# Translation Plan

## Source

The sole source is `content/books/zarb-e-kaleem.json`, which contains 25 kalams. The Urdu field supplies meaning; transliteration verifies line-level traceability and stanza structure.

## Batch workflow

Process consecutive kalams in batches of five. Read the complete five-record JSON extraction before translating. Never translate from previews, summaries, guessed URLs, or shortened terminal output.

Each batch must preserve every nonblank source line one-to-one and every stanza boundary. Complete and verify a batch before recording it as complete. Do not split kalams or stanzas across manuscript files.

## Batch 01: approved starting batch

- Coverage: JSON indices 0-4, kalams 001-005, in exact JSON order.
- Records: `nazreen-se-2`, `tamheed`, `islam-aur-musalman-subah`, `la-ilaha-illallah`, `tan-ba-taqdeer`.
- Source total: 5 kalams, 26 stanzas, 50 nonblank Urdu lines and 50 nonblank transliteration lines, including the preserved `(1)` and `(2)` section labels; 48 of these are poetic lines.
- Manuscript: `manuscript/01-zarb-e-kaleem-english-01.md`.
- Status: Complete after source comparison, metadata/order/count checks, hygiene checks, and `git diff --check`.

## Batch 02

- Coverage: JSON indices 5-9, kalams 006-010, in exact JSON order.
- Records: `miraj`, `zameen-o-asman`, `musalman-ka-zawal`, `ilm-o-ishq`, `ijtihaad`.
- Source total: 5 kalams, 23 stanzas, 46 nonblank Urdu lines and 46 nonblank transliteration lines.
- Manuscript: `manuscript/01-zarb-e-kaleem-english-01.md`.
- Status: Complete after source comparison, metadata/order/count checks, hygiene checks, and `git diff --check`.

## Batch 03

- Coverage: JSON indices 10-14, kalams 011-015, in exact JSON order.
- Records: `shukar-o-shikayat`, `zikar-o-fikar`, `mullah-e-haram`, `taqdeer`, `touheed`.
- Source total: 5 kalams, 18 stanzas, 36 nonblank Urdu lines and 36 nonblank transliteration lines.
- Manuscript: `manuscript/01-zarb-e-kaleem-english-01.md`.
- Status: Complete after source comparison, metadata/order/count checks, hygiene checks, and `git diff --check`.

## Batch 04

- Coverage: JSON indices 15-19, kalams 016-020, in exact JSON order.
- Records: `ilm-aur-irfan`, `hindi-musalman`, `azadi-e-shamsheer-ke-alan-par`, `islam`, `falsafa`.
- Source total: 5 kalams, 20 stanzas, 40 nonblank Urdu lines.
- Manuscript: `manuscript/01-zarb-e-kaleem-english-01.md`.
- Status: Complete after source comparison, metadata/order/count checks, hygiene checks, and `git diff --check`.

## Batch 05

- Coverage: JSON indices 20-24, kalams 021-025, in exact JSON order.
- Records: `mardan-e-khuda`, `kafir-o-momin`, `mahdi-e-barhaq`, `momin`, `mard-e-musalman`.
- Source total: 5 kalams, 23 stanzas, 48 nonblank lines including 2 section markers; 46 poetic lines.
- Manuscript: `manuscript/01-zarb-e-kaleem-english-01.md`.
- Status: Complete after source comparison, metadata/order/count checks, hygiene checks, and `git diff --check`.

## Verification requirements

- Confirm source and manuscript kalam order, exact slugs, exact titles, exact URLs, stanza counts, and nonblank line counts.
- Compare each translated line against Urdu meaning and transliteration traceability.
- Confirm no omissions, duplicates, displaced entries, unrelated changes, Urdu/Devanagari leakage, HTML, Latin honorifics, or translator commentary.
- Confirm all changed files remain under 1,000 lines and run `git diff --check`.
