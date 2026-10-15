# Addawatul Makkiyyah — Independent English Edition

This is the independent English translation prepared from
`content/books/addawatul-makkiyyah.json`. The unrelated existing English edition is not used as a
translation source.

## Digital Exports

- The project produces HTML, one digital PDF, EPUB, and DOCX. It does **not** produce a print-PDF
  variant; the PDF export is digital only.
- The warm amber theme is maintained in `layout/warm-amber.css` and loaded by
  `layout/export-config.json`.
- Update colors and typography in the CSS theme file; export settings and cover text are in the
  JSON config file.
- Generate the digital PDF and its HTML preview with:

  ```sh
  npm run export:addawatul:json
  ```

- Output:
  - `exports/pdf/addawatul-makkiyyah-english-digital.pdf`
  - `exports/html/addawatul-makkiyyah-english-digital.html`
  - `exports/epub/addawatul-makkiyyah-english.epub`
  - `exports/docx/addawatul-makkiyyah-english.docx`
- Project progress and draft status are tracked internally; they are not printed on the cover.
