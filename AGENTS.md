# Islamic Knowledge — AGENTS.md

## Translation rules

Preserve Arabic script from the source exactly as-is. Do NOT romanize/transliterate Arabic terms, Quranic phrases, or Islamic terms. Keep them in the original Arabic script (e.g., المُوتَفِکَة, not al-Mu'tafika).

### Adab for the Prophet ﷺ in translations

1. **Death reference** — Never attribute death directly to the Prophet. Use *"departed (from this world)"*, *"passed away"*, or *"was called back"*, never *"died"* or *"death of the Prophet"*.
2. **No diminishing phrasing** — Never use *"no more than"* for the Prophet. Use *"but"*, *"purely"*, or *"indeed"* (e.g., *"Muhammad is but a Messenger"*).
3. **Preserve ﷺ** — Always keep the `ﷺ` symbol after the Prophet's name wherever it appears in the source.
4. **Vocative address** — Where the Arabic has `قُلْ`, `يَا أَيُّهَا النَّبِيُّ`, or similar, render as *"Say (O Beloved)"* or *"O Prophet"*, not a bare *"Say:"*. This maintains reverent direct address.
5. **Elevated epithets** — Prefer honorific renderings consistent with Ahlus-Sunnah convention (e.g., *"Present Eyewitness (Haazir and Naazir)"* for *shahidan*, *"distinctive bondsman of Ours"* for *abdina*).
6. **Reference** — When uncertain about adab, compare against `content/books/kanzul-iman-english.json` (Kanzul Iman English) as the benchmark for appropriate reverence.

## Batch translation workflow

When a book chapter is too large for a single batch file, split into sequential sub-batches (`01-batch.md`, `02-batch.md`, etc.). Each sub-batch should cover a logically self-contained portion of the narrative (e.g., "introduction through first major event", "second major event", "remaining story"). Always check the last sub-batch's end point before starting the next one to ensure continuity. Keep each batch focused and complete enough to verify independently. Never summarize the source. Always preserve the tone of the author.

When translating a book, always read the book's own rule files in its `notes/` directory (`publishing/<book>/notes/translation-style-guide.md`, `glossary.md`, `editorial-decisions.md`) before starting — these book-level rules take precedence over the generic rules in this file. Create/update them as translation decisions are made.


## Quick start

```bash
npm run dev        # local dev server at localhost:3000
npm run build      # static build (all pages pre-rendered)
npm run lint       # ESLint (flat config, Next.js rules)
```

No typecheck script in `package.json` — run `npx tsc --noEmit` manually when needed.

## Architecture

**Next.js 16 App Router** fully static site. Book content lives as JSON in `content/books/`. All pages use `dynamicParams = false` + `generateStaticParams()` — adding a new book JSON file automatically generates its pages on next build.

### Routes

| Path | Source | Description |
|---|---|---|
| `/` | `app/page.tsx` | Home page with featured book |
| `/books` | `app/books/page.tsx` | Book listing |
| `/books/[slug]` | `app/books/[slug]/page.tsx` | Book detail + section list |
| `/books/[slug]/sections/[sectionSlug]` | `app/books/[slug]/sections/[sectionSlug]/page.tsx` | Section reader with prev/next nav |
| `/authors` | `app/authors/page.tsx` | Author listing |
| `/authors/[slug]` | `app/authors/[slug]/page.tsx` | Author detail with book list |

### Key libraries

- **`lib/books.ts`** — reads JSON from `content/books/` (flat, no DB). `getBooks()`, `getBookBySlug()`, `getBookSection()`, `getAuthors()`.
- **`lib/seo.ts`** — `siteConfig` reads `NEXT_PUBLIC_SITE_URL` or `VERCEL_PROJECT_PRODUCTION_URL` env vars for canonical URLs.
- **`components/text-with-salawat.tsx`** — splits text on ﷺ (U+FD3A) and renders it as a superscript. Wrap any title/text that may contain this character.
- **`components/book-sidebar.tsx`** — sticky TOC sidebar for section navigation.

### Styling

Tailwind CSS v4 (`@tailwindcss/postcss`). Custom theme in `app/globals.css` using `@theme inline`. Warm background (`#f7f2e8`), emerald-950 foreground, gold selection color.

### Data convention

Book JSON schema is typed in `lib/books.ts` (`Book`, `BookSection`, `FormattedBookPage`, etc.). Each book has `pages[]` (raw extracted) and/or `sections[]` (structured with `paragraphs`). Language field varies: `"Roman Urdu"`, `"Urdu"`, `"Hindi"`, `"English"`.

## Publishing pipeline (`publishing/`)

Each publishable book has a directory with:
- `manuscript/` — Markdown manuscript
- `layout/` — CSS, title page, publishing note templates
- `assets/` — cover image
- `exports/` — generated HTML/PDF/EPUB files
- `metadata.yaml` — book metadata

### Export scripts (`scripts/`)

| Script | What it does |
|---|---|
| `export_ikhteyarate_mustafa_hindi.mjs` | Manuscript → HTML + digital/print PDF + EPUB via Playwright |
| `export_*_english.mjs` | Same pattern for English books |
| `html-to-docx.mjs` | HTML → DOCX with configurable theme |
| `extract_epub_book.mjs` | EPUB → text extraction |
| `extract_pdf_book.py` / `extract_pdf_ocr.py` | PDF text extraction (Python) |
| `format_book_content.py` / `normalize_book_text.py` | Text cleanup (Python) |
| `gen_cover_placeholder.py` | Auto-generate cover images |

Only `export:ikhteyarate:hindi` is wired into `package.json`. Run other scripts directly: `node scripts/<script>.mjs` or `python scripts/<script>.py`.

## Gotchas

- No CI/CD workflows in repo. Deployed via Vercel. `.env.local` has a single `PHISING_IP` variable (not used by the app).
- Adding a new book JSON to `content/books/` is enough — routes auto-register via `generateStaticParams`.
- `.env*` files are gitignored. Don't commit `.env.local`.
- Publishing directories (`publishing/`) are separate from the website content (`content/books/`). The website reads only from `content/books/*.json`.
- `TextWithSalawat` component is used throughout — wrap any rendered title/heading that may contain the ﷺ character.
- The repo has both `.mjs` (Node) and `.py` (Python) scripts. Python scripts need local Python setup with PyMuPDF etc.

