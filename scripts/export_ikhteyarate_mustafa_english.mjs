import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AdmZip from "adm-zip";
import { PDFDocument } from "pdf-lib";
import { chromium } from "playwright";
import htmlToDocx from "./html-to-docx.mjs";

const root = process.cwd();
const projectDir = path.join(root, "publishing", "ikhteyarate-mustafa-english");
const manuscriptDir = path.join(projectDir, "manuscript");
const titlePath = path.join(projectDir, "layout", "title-page.md");
const cssPath = path.join(projectDir, "layout", "book.css");
const coverPath = path.join(projectDir, "assets", "cover.png");
const outDir = path.join(projectDir, "exports", "html");
const outPath = path.join(outDir, "ikhteyarate-mustafa-english.html");
const pdfDir = path.join(projectDir, "exports", "pdf");
const epubDir = path.join(projectDir, "exports", "epub");
const docxDir = path.join(projectDir, "exports", "docx");
const printDir = path.join(projectDir, "exports", "print");
const digitalPdfPath = path.join(pdfDir, "ikhteyarate-mustafa-english-digital.pdf");
const printPdfPath = path.join(printDir, "ikhteyarate-mustafa-english-print.pdf");
const epubPath = path.join(epubDir, "ikhteyarate-mustafa-english.epub");
const pdfPageSize = { width: "148mm", height: "210mm" };

const manuscriptFiles = fs.readdirSync(manuscriptDir).filter(f => f.endsWith(".md")).sort();

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

    // Blockquote lines — always poetry. Strip '> ' prefix and add to poetry block.
    const blockquote = /^>\s*(.*)$/.exec(trimmed);
    if (blockquote) {
      const content = blockquote[1];
      if (content) {
        closeList();
        poetry.push(content);
      } else {
        closePoetry();
      }
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

function getTocEntries() {
  const entries = [];
  for (const file of manuscriptFiles) {
    const fp = path.join(manuscriptDir, file);
    const m = fs.readFileSync(fp, "utf8").match(/^#{1,2}\s+(.+)$/m);
    if (m) {
      entries.push({ title: m[1].trim(), file, rawHeading: m[0].trim() });
    }
  }
  return entries;
}

function readManuscript() {
  const parts = [];
  for (const file of manuscriptFiles) {
    const fp = path.join(manuscriptDir, file);
    parts.push(fs.readFileSync(fp, "utf8"));
  }
  return parts.join("\n\n");
}

const tocEntries = getTocEntries();
const title = fs.readFileSync(titlePath, "utf8");
const manuscript = readManuscript();
const css = fs.readFileSync(cssPath, "utf8");
const coverDataUrl = imageDataUrl(coverPath);
const titleLines = title.trim().split("\n").map((l) => l.trim()).filter(Boolean);

const coverHtml = `
<section class="cover-page" aria-label="Book cover">
  <img src="${coverDataUrl}" alt="Ikhteyarate Mustafa cover">
</section>`;

const titleHtml = `
<section class="title-page">
  <h1>${inline(titleLines[0].replace(/^#\s+/, ""))}</h1>
  <p class="subtitle">${inline(titleLines[1] ?? "")}</p>
  <p class="author">${inline(titleLines[2]?.replace(/^Author:\s+/, "") ?? "")}</p>
</section>`;

function generateTocHtml() {
  const rows = tocEntries.map((entry) => {
    return `<div class="toc-row"><span class="toc-title">${inline(entry.title)}</span></div>`;
  }).join("\n");
  return `<section class="toc-page"><h1>Contents</h1>${rows}</section>`;
}

const tocHtml = generateTocHtml();
const manuscriptHtml = markdownToHtml(manuscript);

const document = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ikhteyarate Mustafa</title>
  <style>${css}</style>
</head>
<body>
  <main class="book">
    ${coverHtml}
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
  <title>Ikhteyarate Mustafa</title>
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

// Digital PDF gets a slightly larger base font
const digitalCssOverride = `html { font-size: 16px; line-height: 1.7; }
@media print { html { font-size: 15.5px; } }
.title-page h1 { color: var(--accent); }`;

const digitalContentDocument = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ikhteyarate Mustafa</title>
  <style>${css}
${digitalCssOverride}</style>
</head>
<body>
  <main class="book">
    ${titleHtml}
    ${tocHtml}
    ${manuscriptHtml}
  </main>
</body>
</html>`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, document, "utf8");
console.log(`Wrote ${path.relative(root, outPath)}`);

async function writePdf({ outputPath, headerTemplate, footerTemplate, margin, contentHtml }) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const tempDir = path.join(projectDir, "exports", ".tmp");
  fs.mkdirSync(tempDir, { recursive: true });
  const coverPdfPath = path.join(tempDir, "cover.pdf");
  const contentHtmlPath = path.join(tempDir, "content.html");
  const contentPdfPath = path.join(tempDir, "content.pdf");
  fs.writeFileSync(contentHtmlPath, contentHtml, "utf8");

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

function getEpubSections() {
  const sections = [];
  for (const file of manuscriptFiles) {
    const content = fs.readFileSync(path.join(manuscriptDir, file), "utf8");
    const m = content.match(/^#{1,2}\s+(.+)$/m);
    const title = m ? m[1].trim() : file.replace(/\.md$/, "");
    sections.push({
      title,
      markdown: content,
      file: `section-${String(sections.length + 1).padStart(2, "0")}.xhtml`,
    });
  }

  const result = [
    { title: "Title Page", markdown: titleLines[0].replace(/^#\s+/, "").trim(), file: "title.xhtml" },
    { title: "Contents", markdown: "", file: "contents.xhtml" },
    ...sections,
  ];
  return result;
}

const epubSections = getEpubSections();

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
    <meta name="dtb:uid" content="urn:islamic-knowledge:ikhteyarate-mustafa-english"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>Ikhteyarate Mustafa</text></docTitle>
  <navMap>
${ncxItems}
  </navMap>
</ncx>`);
  addText(zip, "OEBPS/cover.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>Cover</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body><section class="cover-page"><img src="images/cover.png" alt="Ikhteyarate Mustafa cover"/></section></body>
</html>`);
  addText(zip, "OEBPS/contents.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>Ikhteyarate Mustafa</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body>${(function() {
  const rows = epubSections.slice(2).map((s) => `<li><a href="${s.file}">${inline(s.title)}</a></li>`).join("\n");
  return `<main class="book epub-contents"><h1>Contents</h1><ol class="epub-toc">${rows}</ol></main>`;
})()}</body>
</html>`);

  for (const section of epubSections) {
    let bodyClass = "book section-book";
    let mainContent;
    if (section.file === "title.xhtml") {
      bodyClass = "book";
      mainContent = `${titleHtml}`;
    } else if (section.file === "contents.xhtml") {
      continue;
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
    <dc:identifier id="bookid">urn:islamic-knowledge:ikhteyarate-mustafa-english</dc:identifier>
    <dc:title>Ikhteyarate Mustafa</dc:title>
    <dc:language>en</dc:language>
    <dc:creator>Imran Raza Attari</dc:creator>
    <dc:publisher>Islamic Knowledge</dc:publisher>
    <meta name="cover" content="cover-image"/>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, "Z")}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>
    <item id="cover-image" href="images/cover.png" media-type="image/png" properties="cover-image"/>
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

await writePdf({
  outputPath: digitalPdfPath,
  headerTemplate: `<div style="box-sizing: border-box; color: #0f5a3e; font-family: Georgia, 'Times New Roman', serif; font-size: 9px; padding: 6px 16mm 0; text-align: left; width: 100%;">Ikhteyarate Mustafa</div>`,
  footerTemplate: `<div style="color: #4f463a; font-family: Georgia, 'Times New Roman', serif; font-size: 9px; padding: 0 0 6px; text-align: center; width: 100%;"><span class="pageNumber"></span></div>`,
  margin: { top: "18mm", right: "16mm", bottom: "22mm", left: "16mm" },
  contentHtml: digitalContentDocument,
});

await writePdf({
  outputPath: printPdfPath,
  headerTemplate: `<div></div>`,
  footerTemplate: `<div style="color: #4f463a; font-family: Georgia, 'Times New Roman', serif; font-size: 9px; padding: 0 0 6px; text-align: center; width: 100%;"><span class="pageNumber"></span></div>`,
  margin: { top: "16mm", right: "18mm", bottom: "20mm", left: "18mm" },
  contentHtml: contentDocument,
});

writeEpub();

async function writeDocx() {
  fs.mkdirSync(docxDir, { recursive: true });
  const html = fs.readFileSync(outPath, "utf8");
  const buffer = await htmlToDocx(html, {
    accent: "0F5A3E", accentWarm: "7A3D22", ink: "17130F",
    muted: "6F6252", gold: "B8944F",
  });
  const docxPath = path.join(docxDir, "ikhteyarate-mustafa-english.docx");
  fs.writeFileSync(docxPath, buffer);
  console.log(`Wrote ${path.relative(root, docxPath)}`);
}

await writeDocx();
