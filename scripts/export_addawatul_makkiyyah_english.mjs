import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AdmZip from "adm-zip";
import { PDFDocument } from "pdf-lib";
import { chromium } from "playwright";
import htmlToDocx from "./html-to-docx.mjs";

const root = process.cwd();
const projectDir = path.join(root, "publishing", "addawatul-makkiyyah-english");
const manuscriptDir = path.join(projectDir, "manuscript");
const titlePath = path.join(projectDir, "layout", "title-page.md");
const cssPath = path.join(projectDir, "layout", "book.css");
const outDir = path.join(projectDir, "exports", "html");
const outPath = path.join(outDir, "addawatul-makkiyyah-english.html");
const pdfDir = path.join(projectDir, "exports", "pdf");
const epubDir = path.join(projectDir, "exports", "epub");
const docxDir = path.join(projectDir, "exports", "docx");
const printDir = path.join(projectDir, "exports", "print");
const digitalPdfPath = path.join(pdfDir, "addawatul-makkiyyah-english-digital.pdf");
const printPdfPath = path.join(printDir, "addawatul-makkiyyah-english-print.pdf");
const epubPath = path.join(epubDir, "addawatul-makkiyyah-english.epub");
const pdfPageSize = {
  width: "148mm",
  height: "210mm",
};

const manuscriptFiles = [
  "00-front-matter/02-hamd.md",
  "00-front-matter/03-arze-nashir.md",
  "00-front-matter/04-background.md",
  "01-nazre-awwal.md",
  "02-nazre-duwum.md",
  "03-nazre-siwum.md",
  "04-nazre-chaharum.md",
  "05-nazre-panjum.md",
  "06-nazre-shashum.md",
  "07-dosra-hissa.md",
  "90-back-matter/01-glossary.md",
  "90-back-matter/02-quranic-verse-index.md",
  "90-back-matter/03-biographical-notes.md",
  "90-back-matter/04-works-cited.md",
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
    .replaceAll(/`([^`]+)`/g, "<span class=\"reference\">$1</span>")
    .replaceAll(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replaceAll(/\*([^*]+)\*/g, "<em>$1</em>");
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

function isPoetryLine(line) {
  if (!line.trim()) return false;
  if (/^(#|>|[-*] |\d+\.)/.test(line.trim())) return false;
  if (/^`.*`$/.test(line.trim())) return false;
  if (/[.!?\u060C\u061F:]$/.test(line.trim())) return false;
  return line.trim().length <= 70;
}

function markdownToHtml(markdown, tocRawHeadings = []) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const html = [];
  let paragraph = [];
  let poetry = [];
  let listOpen = false;
  let blockquote = false;

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

  function closeBlockquote() {
    if (blockquote) {
      html.push("</blockquote>");
      blockquote = false;
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
      closeBlockquote();
      const level = heading[1].length;
      const isToc = tocRawHeadings.includes(trimmed);
      html.push(`<h${level}${isToc ? ' data-toc-section=""' : ''}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith("> ")) {
      closeParagraph();
      closePoetry();
      closeList();
      if (!blockquote) {
        html.push("<blockquote>");
        blockquote = true;
      }
      html.push(`<p>${inline(trimmed.slice(2))}</p>`);
      continue;
    }

    if (trimmed === "---") {
      closeParagraph();
      closePoetry();
      closeList();
      closeBlockquote();
      html.push("<hr>");
      continue;
    }

    if (trimmed.startsWith("- ")) {
      closeParagraph();
      closePoetry();
      closeBlockquote();
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
      closeBlockquote();
      html.push(`<p class="reference">${inline(trimmed.slice(1, -1))}</p>`);
      continue;
    }

    if (isPoetryLine(trimmed) && !paragraph.length) {
      closeList();
      closeBlockquote();
      poetry.push(trimmed);
      continue;
    }

    closePoetry();
    closeList();
    closeBlockquote();
    paragraph.push(trimmed);
  }

  closeParagraph();
  closePoetry();
  closeList();
  closeBlockquote();

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

  const result = [titleSection];
  result.push({ title: "Contents", markdown: "", file: "contents.xhtml" });
  for (const s of sections) {
    result.push({ ...s, markdown: s.markdown.join("\n") });
  }
  return result;
}

function getTocEntries() {
  function firstHeading(file) {
    const fp = path.join(manuscriptDir, file);
    if (!fs.existsSync(fp)) return null;
    const m = fs.readFileSync(fp, "utf8").match(/^#{1,2}\s+(.+)$/m);
    return m ? { raw: m[0].trim(), text: m[1].trim() } : null;
  }

  const items = [];

  // Front matter
  for (const f of ["00-front-matter/02-hamd.md", "00-front-matter/03-arze-nashir.md", "00-front-matter/04-background.md"]) {
    const h = firstHeading(f);
    if (h) items.push({ title: h.text, rawHeading: h.raw, type: "major", hasContent: true });
  }

  // Views — each file is a major section
  const viewFiles = [
    "01-nazre-awwal.md",
    "02-nazre-duwum.md",
    "03-nazre-siwum.md",
    "04-nazre-chaharum.md",
    "05-nazre-panjum.md",
    "06-nazre-shashum.md",
    "07-dosra-hissa.md",
  ];

  for (const f of viewFiles) {
    const h = firstHeading(f);
    if (h) items.push({ title: h.text, rawHeading: h.raw, type: "major", hasContent: true });
  }

  // Back matter
  for (const f of ["90-back-matter/01-glossary.md", "90-back-matter/02-quranic-verse-index.md", "90-back-matter/03-biographical-notes.md", "90-back-matter/04-works-cited.md"]) {
    const h = firstHeading(f);
    if (h) items.push({ title: h.text, rawHeading: h.raw, type: "major", hasContent: true });
  }

  return items;
}

function generateTocHtml(entries, pageMap) {
  const rows = entries.map((item, idx) => {
    const cls = item.type === "major" ? "toc-major" : "toc-chapter";
    const pg = pageMap ? pageMap[idx] : null;
    const pgHtml = pg ? `<span class="toc-pages">${pg.start === pg.end ? pg.start : `${pg.start}\u2013${pg.end}`}</span>` : "";
    return `<div class="toc-row ${cls}"><span class="toc-title">${inline(item.title)}</span><span class="toc-leader"></span>${pgHtml}</div>`;
  }).join("\n");
  return `<section class="toc-page"><h1>Contents</h1>${rows}</section>`;
}

const tocEntries = getTocEntries();
const tocRawHeadings = tocEntries.filter(e => e.hasContent).map(e => e.rawHeading);
const title = fs.readFileSync(titlePath, "utf8");
const manuscript = readManuscript();
const css = fs.readFileSync(cssPath, "utf8");
const titleLines = title.trim().split("\n").map((l) => l.trim()).filter(Boolean);

const titleHtml = `
<section class="title-page">
  <h1>${inline(titleLines[0].replace(/^#\s+/, ""))}</h1>
  <p class="subtitle">${inline(titleLines[1] ?? "")}</p>
  <p class="author">${inline(titleLines[2]?.replace(/^By\s+/, "") ?? "")}</p>
  <p class="translator">${inline(titleLines[3] ?? "")}</p>
</section>`;

// --- Pass 1: count pages per section ---
function sectionHtml(md) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Addawatul Makkiyyah</title><style>${css}</style></head><body><main class="book">${markdownToHtml(md, tocRawHeadings)}</main></body></html>`;
}

const pageCounts = await countSectionPages(tocEntries, manuscript, sectionHtml);

// Count front matter (title + toc) pages to determine content offset
const tempTocHtml = generateTocHtml(tocEntries, null);
const frontMatterHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Addawatul Makkiyyah</title><style>${css}</style></head><body><main class="book">${titleHtml}${tempTocHtml}</main></body></html>`;
const frontBrowser = await chromium.launch();
const frontPage = await frontBrowser.newPage();
await frontPage.setContent(frontMatterHtml, { waitUntil: "networkidle" });
const frontPdfBuf = await frontPage.pdf({
  width: pdfPageSize.width, height: pdfPageSize.height,
  printBackground: true, preferCSSPageSize: true,
  margin: { top: "18mm", right: "16mm", bottom: "20mm", left: "16mm" },
});
await frontPage.close();
await frontBrowser.close();
const frontDoc = await PDFDocument.load(frontPdfBuf);
const frontPages = frontDoc.getPageCount();

// Calculate cumulative page numbers
const pageMap = {};
let cumPage = frontPages + 1;
const contentIdx = [];
for (let i = 0; i < tocEntries.length; i++) {
  const cnt = pageCounts[i] || 0;
  if (cnt > 0) {
    pageMap[i] = { start: cumPage, end: cumPage + cnt - 1 };
    cumPage += cnt;
    contentIdx.push(i);
  }
}
const totalPages = cumPage - 1;

// Forward-fill page numbers for structural entries (parts without own content)
let nextPg = null;
for (let i = tocEntries.length - 1; i >= 0; i--) {
  if (pageMap[i]) {
    nextPg = pageMap[i];
  } else if (tocEntries[i].type === "major" && !tocEntries[i].hasContent) {
    if (nextPg) pageMap[i] = { ...nextPg };
  }
}

const tocHtml = generateTocHtml(tocEntries, pageMap);
const manuscriptHtml = markdownToHtml(manuscript, tocRawHeadings);
const epubSections = getEpubSections(manuscript);

const document = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Addawatul Makkiyyah</title>
  <style>${css}</style>
</head>
<body>
  <main class="book">
    ${titleHtml}
    ${tocHtml}
    ${manuscriptHtml}
  </main>
</body>
</html>`;

const contentDocument = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Addawatul Makkiyyah</title>
  <style>${css}</style>
</head>
<body>
  <main class="book">
    ${titleHtml}
    ${tocHtml}
    ${manuscriptHtml}
  </main>
</body>
</html>`;

const digitalTocHtml = generateTocHtml(tocEntries, null);
const digitalCss = css.replaceAll(/@page[\s\S]*?}\n\n/g, "@page { size: A5; margin: 14mm 14mm 16mm 14mm; }\n\n") + `\nhtml { font-size: 18px !important; line-height: 1.7 !important; }\n.book { padding: 0 !important; max-width: none !important; box-shadow: none !important; }\n`;

const digitalContentDocument = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Addawatul Makkiyyah</title>
  <style>${digitalCss}</style>
</head>
<body>
  <main class="book">
    ${titleHtml}
    ${digitalTocHtml}
    ${manuscriptHtml}
  </main>
</body>
</html>`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, document, "utf8");
console.log(`Wrote ${path.relative(root, outPath)}`);

async function countSectionPages(entries, manuscriptMd, getHtmlFn) {
  const contentOnly = entries.filter(e => e.hasContent);
  const chunks = [];
  const lines = manuscriptMd.replaceAll("\r\n", "\n").split("\n");
  let current = null;
  for (const line of lines) {
    const entryIdx = contentOnly.findIndex(e => e.rawHeading === line.trim());
    if (entryIdx >= 0) {
      if (current) chunks.push(current);
      current = { idx: entryIdx, lines: [line] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) chunks.push(current);

  const browser = await chromium.launch();
  const pageCounts = new Array(contentOnly.length).fill(0);
  try {
    for (const chunk of chunks) {
      const html = getHtmlFn(chunk.lines.join("\n"));
      const contentPage = await browser.newPage();
      await contentPage.setContent(html, { waitUntil: "networkidle" });
      const pdfBuf = await contentPage.pdf({
        ...{ width: "148mm", height: "210mm" },
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "18mm", right: "16mm", bottom: "20mm", left: "16mm" },
      });
      await contentPage.close();
      const doc = await PDFDocument.load(pdfBuf);
      pageCounts[chunk.idx] = doc.getPageCount();
    }
  } finally {
    await browser.close();
  }
  const result = new Array(entries.length).fill(0);
  let ci = 0;
  for (let ei = 0; ei < entries.length; ei++) {
    if (entries[ei].hasContent) {
      result[ei] = pageCounts[ci];
      ci++;
    }
  }
  return result;
}

async function writePdf({ outputPath, headerTemplate, footerTemplate, margin, document: doc }) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const tempDir = path.join(projectDir, "exports", ".tmp");
  fs.mkdirSync(tempDir, { recursive: true });
  const contentHtmlPath = path.join(tempDir, "content.html");
  const contentPdfPath = path.join(tempDir, "content.pdf");
  fs.writeFileSync(contentHtmlPath, doc ?? contentDocument, "utf8");

  const browser = await chromium.launch();
  try {
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

    const merged = await PDFDocument.create();
    const source = await PDFDocument.load(fs.readFileSync(contentPdfPath));
    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) merged.addPage(page);
    fs.writeFileSync(outputPath, await merged.save());
  } finally {
    await browser.close();
  }
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
  border: 2px double #5f7b8b;
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
    <meta name="dtb:uid" content="urn:islamic-knowledge:addawatul-makkiyyah-english"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>Addawatul Makkiyyah</text></docTitle>
  <navMap>
${ncxItems}
  </navMap>
</ncx>`);
  addText(zip, "OEBPS/cover.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>Cover</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body><section class="cover-page" style="background:#0b2a3a;height:100vh;"><p style="color:white;text-align:center;padding-top:45vh;font-size:1.8rem;">Addawatul Makkiyyah</p></section></body>
</html>`);
  addText(zip, "OEBPS/contents.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>Addawatul Makkiyyah — English Translation</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body>${epubContentsHtml(epubSections)}</body>
</html>`);

  for (const section of epubSections) {
    let bodyClass = "book section-book";
    let mainContent;
    if (section.file === "title.xhtml") {
      bodyClass = "book";
      mainContent = `${titleHtml}`;
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
    <dc:identifier id="bookid">urn:islamic-knowledge:addawatul-makkiyyah-english</dc:identifier>
    <dc:title>Addawatul Makkiyyah</dc:title>
    <dc:language>en</dc:language>
    <dc:creator>Imam Ahmad Raza Khan Barelvi</dc:creator>
    <dc:publisher>Abde Mustafa Publications</dc:publisher>
    <meta name="cover" content="cover-image"/>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, "Z")}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>
    <item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>
    <item id="contents" href="contents.xhtml" media-type="application/xhtml+xml"/>
${manifestSections}
    <item id="css" href="styles/book.css" media-type="text/css"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="cover"/>
    <itemref idref="title"/>
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

async function writeDocx() {
  fs.mkdirSync(docxDir, { recursive: true });
  const html = fs.readFileSync(outPath, "utf8");
  const buffer = await htmlToDocx(html, {
    accent: "1A4C7A", accentWarm: "8B3A2A", ink: "17130F",
    muted: "6F6252", gold: "B8944F",
  });
  const docxPath = path.join(docxDir, "addawatul-makkiyyah-english.docx");
  fs.writeFileSync(docxPath, buffer);
  console.log(`Wrote ${path.relative(root, docxPath)}`);
}

await writePdf({
  outputPath: digitalPdfPath,
  headerTemplate: `<div style="box-sizing: border-box; color: #1a4c7a; font-family: Georgia, 'Times New Roman', serif; font-size: 9px; padding: 6px 16mm 0; text-align: left; width: 100%;">Addawatul Makkiyyah</div>`,
  footerTemplate: `<div style="color: #4f463a; font-family: Georgia, 'Times New Roman', serif; font-size: 9px; padding: 0 0 6px; text-align: center; width: 100%;"><span class="pageNumber"></span></div>`,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  document: digitalContentDocument,
});
await writePdf({
  outputPath: printPdfPath,
  headerTemplate: `<div></div>`,
  footerTemplate: `<div style="color: #4f463a; font-family: Georgia, 'Times New Roman', serif; font-size: 9px; padding: 0 0 6px; text-align: center; width: 100%;"><span class="pageNumber"></span></div>`,
  margin: {
    top: "16mm",
    right: "18mm",
    bottom: "20mm",
    left: "18mm",
  },
  document: contentDocument,
});
writeEpub();
await writeDocx();
