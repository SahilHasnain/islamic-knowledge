# Generated library editions

The JSON files in this directory are generated from the selected publishing manuscripts. Do not
edit them directly; edit the Markdown manuscripts and regenerate with:

```sh
npm run build:published-books
```

Schema version 2 keeps Markdown structure as reader-ready JSON blocks. Paragraphs, headings, and
quotations have `runs`; each run has text and optional `marks` (`bold`, `italic`, `code`,
`superscript`, or `subscript`) and an optional link `href`. Lists contain ordered `items` with
their own runs. The reader renders these structures without parsing Markdown at runtime.

Each section records its source manuscript path. Edition status is retained in the book metadata
so unfinished translations are identified in the reader.
