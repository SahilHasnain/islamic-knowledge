# Seerate Mustafa English Translation Project

This directory is for the PDF, EPUB, and print manuscript of the English edition of *Seerate Mustafa* by Allama Abdul Mustafa Aazmi.

Source: `content/books/seerate-mustafa.json` (Roman Urdu, 757 pages)

## Current Status

- Status: New translation in progress.
- Source language: Roman Urdu
- Target language: English
- Translation is being done directly from the Roman Urdu source (no legacy English draft exists).

## Workflow

1. Translate in batches directly from the Roman Urdu source in `content/books/seerate-mustafa.json`.
2. Each batch produces one or more manuscript files under `manuscript/`.
3. Keep translation decisions in `notes/translation-style-guide.md`.
4. Add recurring terms to `notes/glossary.md`.
5. Record larger editorial decisions in `notes/editorial-decisions.md`.
6. Export generated files only under `exports/`.

## Organization

The source book is organized into chapters (Baabs). The manuscript follows this structure:

- `01-pehla-baab/` - First Chapter: Family Background
- `02-dusra-baab/` - Second Chapter: Childhood
- etc.
