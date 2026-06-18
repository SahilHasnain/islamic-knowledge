import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AdmZip from "adm-zip";
import { PDFDocument } from "pdf-lib";
import { chromium } from "playwright";

const root = process.cwd();
const projectDir = path.join(root, "publishing", "shifa-shareef-english");
const manuscriptDir = path.join(projectDir, "manuscript");
const titlePath = path.join(projectDir, "layout", "title-page.md");
const cssPath = path.join(projectDir, "layout", "book.css");
const coverPath = path.join(projectDir, "assets", "cover.png");
const outDir = path.join(projectDir, "exports", "html");
const outPath = path.join(outDir, "shifa-shareef-english.html");
const pdfDir = path.join(projectDir, "exports", "pdf");
const epubDir = path.join(projectDir, "exports", "epub");
const printDir = path.join(projectDir, "exports", "print");
const digitalPdfPath = path.join(pdfDir, "shifa-shareef-english-digital.pdf");
const printPdfPath = path.join(printDir, "shifa-shareef-english-print.pdf");
const epubPath = path.join(epubDir, "shifa-shareef-english.epub");
const pdfPageSize = {
  width: "148mm",
  height: "210mm",
};

const publisherNoteFile = "00-front-matter/02-publishers-note.md";

const manuscriptFiles = [
  "00-front-matter/03-about-author.md",
  "00-front-matter/04-about-urdu-translator.md",
  "00-front-matter/05-introduction.md",
  "01-part-one/01-chapter-one.md",
  "01-part-one/02-chapter-two.md",
  "01-part-one/03-chapter-three.md",
  "01-part-one/04-chapter-four.md",
  "02-part-two/01-chapter-one.md",
  "02-part-two/02-chapter-two.md",
  "02-part-two/03-chapter-three.md",
  "02-part-two/04-chapter-four.md",
  "03-part-three/01-chapter-one.md",
  "03-part-three/02-chapter-two.md",
  "04-part-four/01-chapter-one.md",
  "04-part-four/02-chapter-two.md",
  "04-part-four/03-chapter-three.md",
  "90-back-matter/01-glossary.md",
  "90-back-matter/02-index-notes.md",
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function restoreInlineHtml(value) {
  return value
    .replaceAll(/&lt;sup&gt;([\s\S]*?)&lt;\/sup&gt;/g, "<sup>$1</sup>")
    .replaceAll("\uFDFA", '<span class="arabic">\uFDFA</span>')
    .replaceAll("\u0645\u0639\u0627\u0630 \u0627\u0644\u0644\u0647", '<span class="arabic">\u0645\u0639\u0627\u0630 \u0627\u0644\u0644\u0647</span>')
    .replaceAll(/`([^`]+)`/g, "<span class=\"reference\">$1</span>");
}

function inline(value) {
  return restoreInlineHtml(escapeHtml(value));
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function imageDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function isPoetryLine(line) {
  if (!line.trim()) return false;
  if (/^(#|[-*] |\d+\.)/.test(line.trim())) return false;
  if (/^`.*`$/.test(line.trim())) return false;
  if (/[.!?\u060C\u061F:]$/.test(line.trim())) return false;
  return line.trim().length <= 70;
}

function markdownToHtml(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const html = [];
  let paragraph = [];
  let poetry = [];
  let listOpen = false;

  function closeParagraph() {
    if (paragraph.length) {
      html.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  function closePoetry() {
    if (poetry.length) {
      html.push(`<div class="poetry">${poetry.map(inline).join("<br>")}</div>`);
      poetry = [];
    }
  }

  function closeList() {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      closeParagraph();
      closePoetry();
      closeList();
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (heading) {
      closeParagraph();
      closePoetry();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      closeParagraph();
      closePoetry();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inline(trimmed.slice(2))}</li>`);
      continue;
    }

    if (/^`.*`$/.test(trimmed)) {
      closeParagraph();
      closePoetry();
      closeList();
      html.push(`<p class="reference">${inline(trimmed.slice(1, -1))}</p>`);
      continue;
    }

    if (isPoetryLine(trimmed) && !paragraph.length) {
      closeList();
      poetry.push(trimmed);
      continue;
    }

    closePoetry();
    closeList();
    paragraph.push(trimmed);
  }

  closeParagraph();
  closePoetry();
  closeList();

  return html.join("\n");
}

function readManuscript() {
  const parts = [];
  for (const file of manuscriptFiles) {
    const filePath = path.join(manuscriptDir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf8");
      parts.push(content);
    }
  }
  return parts.join("\n\n");
}

function readPublisherNote() {
  const filePath = path.join(manuscriptDir, publisherNoteFile);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf8");
  }
  return "";
}

function getEpubSections(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const sections = [];
  let current = null;

  for (const line of lines) {
    const heading = /^##\s+(.+)$/.exec(line.trim());
    if (heading) {
      if (current) sections.push(current);
      current = {
        title: heading[1].trim(),
        markdown: [line],
        file: `section-${String(sections.length + 1).padStart(2, "0")}.xhtml`,
      };
      continue;
    }
    if (current) current.markdown.push(line);
  }
  if (current) sections.push(current);

  const titleSection = {
    title: "Title Page",
    markdown: titleLines[0].replace(/^#\s+/, "").trim(),
    file: "title.xhtml",
  };

  const noteSection = publisherNoteMd
    ? { title: "Publisher's Note", markdown: publisherNoteMd, file: "publishers-note.xhtml" }
    : null;

  const result = [titleSection];
  if (noteSection) result.push(noteSection);
  for (const s of sections) {
    result.push({ ...s, markdown: s.markdown.join("\n") });
  }
  return result;
}

const title = fs.readFileSync(titlePath, "utf8");
const manuscript = readManuscript();
const publisherNoteMd = readPublisherNote();
const css = fs.readFileSync(cssPath, "utf8");
const coverDataUrl = imageDataUrl(coverPath);

const coverHtml = `
<section class="cover-page" aria-label="Book cover">
  <img src="${coverDataUrl}" alt="Shifa Shareef cover">
</section>`;

const titleLines = title.trim().split("\n").map((l) => l.trim()).filter(Boolean);
const titleHtml = `
<section class="title-page">
  <h1>${inline(titleLines[0].replace(/^#\s+/, ""))}</h1>
  <p class="subtitle">${inline(titleLines[1] ?? "")}</p>
  <p class="author">${inline(titleLines[2]?.replace(/^By\s+/, "") ?? "")}</p>
</section>`;

const publisherNoteHtml = publisherNoteMd
  ? `<section class="publishing-note">${markdownToHtml(publisherNoteMd)}</section>`
  : "";

const manuscriptHtml = markdownToHtml(manuscript);
const epubSections = getEpubSections(manuscript);

const document = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shifa Shareef — English Translation</title>
  <style>${css}</style>
</head>
<body>
  <main class="book">
    ${coverHtml}
    ${titleHtml}
    ${publisherNoteHtml}
    ${manuscriptHtml}
  </main>
</body>
</html>`;

const contentDocument = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shifa Shareef — English Translation</title>
  <style>${css}</style>
</head>
<body>
  <main class="book">
    ${titleHtml}
    ${publisherNoteHtml}
    ${manuscriptHtml}
  </main>
</body>
</html>`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, document, "utf8");
console.log(`Wrote ${path.relative(root, outPath)}`);

async function writePdf({ outputPath, headerTemplate, footerTemplate, margin }) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const tempDir = path.join(projectDir, "exports", ".tmp");
  fs.mkdirSync(tempDir, { recursive: true });
  const coverPdfPath = path.join(tempDir, "cover.pdf");
  const contentHtmlPath = path.join(tempDir, "content.html");
  const contentPdfPath = path.join(tempDir, "content.pdf");
  fs.writeFileSync(contentHtmlPath, contentDocument, "utf8");

  const browser = await chromium.launch();
  const coverPage = await browser.newPage();
  await coverPage.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
    @page { size: ${pdfPageSize.width} ${pdfPageSize.height}; margin: 0; }
    html, body { margin: 0; width: 100%; height: 100%; }
    .cover-page { background: #0b3a2a; display: flex; height: 100vh; overflow: hidden; width: 100vw; }
    .cover-page img { display: block; height: 100%; object-fit: cover; width: 100%; }
  </style></head><body>${coverHtml}</body></html>`, { waitUntil: "networkidle" });
  await coverPage.pdf({
    path: coverPdfPath,
    ...pdfPageSize,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    printBackground: true,
    preferCSSPageSize: true,
  });
  await coverPage.close();

  const contentPage = await browser.newPage();
  await contentPage.goto(pathToFileURL(contentHtmlPath).href, { waitUntil: "networkidle" });
  await contentPage.pdf({
    path: contentPdfPath,
    ...pdfPageSize,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate,
    footerTemplate,
    margin,
  });
  await contentPage.close();
  await browser.close();

  const merged = await PDFDocument.create();
  for (const pdfPath of [coverPdfPath, contentPdfPath]) {
    const source = await PDFDocument.load(fs.readFileSync(pdfPath));
    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) merged.addPage(page);
  }
  fs.writeFileSync(outputPath, await merged.save());
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log(`Wrote ${path.relative(root, outputPath)}`);
}

function addText(zip, filePath, text) {
  zip.addFile(filePath, Buffer.from(text, "utf8"));
}

function epubContentsHtml(entries) {
  const rows = entries
    .map((entry) => `<li><a href="${entry.file}">${inline(entry.title)}</a></li>`)
    .join("\n");
  return `<main class="book epub-contents"><h1>Contents</h1><ol class="epub-toc">${rows}</ol></main>`;
}

function writeEpub() {
  fs.mkdirSync(epubDir, { recursive: true });
  const zip = new AdmZip();
  addText(zip, "mimetype", "application/epub+zip");
  addText(zip, "META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

  const epubCss = css
    .replaceAll(/@page[\s\S]*?}\n\n/g, "")
    .replaceAll(/@media print[\s\S]*$/g, "")
    .replaceAll("box-shadow: 0 18px 60px rgba(45, 30, 12, 0.16);", "")
    .replaceAll("max-width: 760px;", "")
    .replaceAll("padding: 46px 56px 64px;", "padding: 1.2rem 1.15rem 1.8rem;")
    + `

body {
  background: var(--paper);
  margin: 0;
}

.book {
  box-shadow: none;
  margin: 0;
  max-width: none;
  min-height: auto;
}

.section-book {
  padding-top: 1.1rem;
}

.cover-page,
.book > .cover-page {
  height: 100vh;
  margin: 0;
  padding: 0;
}

.title-page {
  border: 2px double #5f8b75;
  min-height: 72vh;
}

.epub-contents h1,
nav h1 {
  color: var(--accent);
  font-size: 1.7rem;
  margin: 1rem 0 1.2rem;
  text-align: center;
}

.epub-toc,
nav ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

.epub-toc li,
nav li {
  border-bottom: 1px dotted #8aa897;
  margin: 0;
  padding: 0.45rem 0;
}

.epub-toc a,
nav a {
  color: var(--accent);
  text-decoration: none;
}

p {
  margin-bottom: 0.85rem;
}
`;

  addText(zip, "OEBPS/styles/book.css", epubCss);
  zip.addFile("OEBPS/images/cover.png", fs.readFileSync(coverPath));
  const navItems = epubSections
    .map((section) => `<li><a href="${section.file}">${escapeXml(section.title)}</a></li>`)
    .join("");
  const manifestSections = epubSections
    .map((section, index) => `    <item id="section-${index + 1}" href="${section.file}" media-type="application/xhtml+xml"/>`)
    .join("\n");
  const spineSections = epubSections
    .map((_, index) => `    <itemref idref="section-${index + 1}"/>`)
    .join("\n");
  const ncxItems = epubSections
    .map((section, index) => `    <navPoint class="chapter" id="nav-${index + 1}" playOrder="${index + 1}">
      <navLabel><text>${escapeXml(section.title)}</text></navLabel>
      <content src="${section.file}"/>
    </navPoint>`)
    .join("\n");

  addText(zip, "OEBPS/nav.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><title>Contents</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body><main class="book epub-contents"><nav epub:type="toc"><h1>Contents</h1><ol>${navItems}</ol></nav><nav epub:type="landmarks" hidden="hidden"><ol><li><a epub:type="cover" href="cover.xhtml">Cover</a></li><li><a epub:type="toc" href="contents.xhtml">Contents</a></li></ol></nav></main></body>
</html>`);
  addText(zip, "OEBPS/toc.ncx", `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en">
  <head>
    <meta name="dtb:uid" content="urn:islamic-knowledge:shifa-shareef-english"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>Shifa Shareef — English Translation</text></docTitle>
  <navMap>
${ncxItems}
  </navMap>
</ncx>`);
  addText(zip, "OEBPS/cover.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>Cover</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body><section class="cover-page"><img src="images/cover.png" alt="Shifa Shareef cover"/></section></body>
</html>`);
  addText(zip, "OEBPS/contents.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>Shifa Shareef — English Translation</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body>${epubContentsHtml(epubSections)}</body>
</html>`);

  for (const section of epubSections) {
    let bodyClass = "book section-book";
    let mainContent;
    if (section.file === "title.xhtml") {
      bodyClass = "book";
      mainContent = `${titleHtml}`;
    } else if (section.file === "publishers-note.xhtml") {
      bodyClass = "book";
      mainContent = `<section class="publishing-note">${markdownToHtml(section.markdown)}</section>`;
    } else {
      mainContent = markdownToHtml(section.markdown);
    }
    addText(zip, `OEBPS/${section.file}`, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>${escapeXml(section.title)}</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body><main class="${bodyClass}">${mainContent}</main></body>
</html>`);
  }

  addText(zip, "OEBPS/package.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:islamic-knowledge:shifa-shareef-english</dc:identifier>
    <dc:title>Shifa Shareef — English Translation</dc:title>
    <dc:language>en</dc:language>
    <dc:creator>Imam Qadi Iyad</dc:creator>
    <dc:publisher>Mustafawi Publishing</dc:publisher>
    <meta name="cover" content="cover-image"/>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, "Z")}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>
    <item id="cover-image" href="images/cover.png" media-type="image/png" properties="cover-image"/>
    <item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>
    <item id="publishers-note" href="publishers-note.xhtml" media-type="application/xhtml+xml"/>
    <item id="contents" href="contents.xhtml" media-type="application/xhtml+xml"/>
${manifestSections}
    <item id="css" href="styles/book.css" media-type="text/css"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="cover"/>
    <itemref idref="title"/>
    <itemref idref="publishers-note"/>
    <itemref idref="contents"/>
${spineSections}
  </spine>
  <guide>
    <reference href="cover.xhtml" title="Cover" type="cover"/>
    <reference href="contents.xhtml" title="Contents" type="toc"/>
  </guide>
</package>`);
  zip.writeZip(epubPath);
  console.log(`Wrote ${path.relative(root, epubPath)}`);
}

await writePdf({
  outputPath: digitalPdfPath,
  headerTemplate: `<div style="box-sizing: border-box; color: #0f5a3e; font-family: Georgia, 'Times New Roman', serif; font-size: 8px; padding: 0 16mm; text-align: left; width: 100%;">Shifa Shareef — English Translation</div>`,
  footerTemplate: `<div style="color: #4f463a; font-family: Georgia, 'Times New Roman', serif; font-size: 8px; text-align: center; width: 100%;"><span class="pageNumber"></span></div>`,
  margin: {
    top: "18mm",
    right: "16mm",
    bottom: "20mm",
    left: "16mm",
  },
});
await writePdf({
  outputPath: printPdfPath,
  headerTemplate: `<div></div>`,
  footerTemplate: `<div style="color: #4f463a; font-family: Georgia, 'Times New Roman', serif; font-size: 8px; text-align: center; width: 100%;"><span class="pageNumber"></span></div>`,
  margin: {
    top: "16mm",
    right: "18mm",
    bottom: "18mm",
    left: "18mm",
  },
});
writeEpub();
