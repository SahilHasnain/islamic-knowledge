import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AdmZip from "adm-zip";
import { chromium } from "playwright";

const root = process.cwd();
const projectDir = path.join(root, "publishing", "ikhteyarate-mustafa-hindi");
const manuscriptPath = path.join(projectDir, "manuscript", "01-ikhteyarate-mustafa.md");
const titlePath = path.join(projectDir, "layout", "title-page.md");
const notePath = path.join(projectDir, "layout", "publishing-note.md");
const cssPath = path.join(projectDir, "layout", "book.css");
const outDir = path.join(projectDir, "exports", "html");
const outPath = path.join(outDir, "ikhteyarate-mustafa-hindi.html");
const pdfDir = path.join(projectDir, "exports", "pdf");
const epubDir = path.join(projectDir, "exports", "epub");
const printDir = path.join(projectDir, "exports", "print");
const digitalPdfPath = path.join(pdfDir, "ikhteyarate-mustafa-hindi-digital.pdf");
const printPdfPath = path.join(printDir, "ikhteyarate-mustafa-hindi-print.pdf");
const epubPath = path.join(epubDir, "ikhteyarate-mustafa-hindi.epub");

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
    .replaceAll("ﷺ", '<span class="arabic">ﷺ</span>')
    .replaceAll("معاذ الله", '<span class="arabic">معاذ الله</span>')
    .replaceAll(/`([^`]+)`/g, "<span class=\"reference\">$1</span>");
}

function inline(value) {
  return restoreInlineHtml(escapeHtml(value));
}

function isPoetryLine(line) {
  if (!line.trim()) return false;
  if (/^(#|[-*] |\d+\.)/.test(line.trim())) return false;
  if (/^`.*`$/.test(line.trim())) return false;
  if (/[।.!?؟:]$/.test(line.trim())) return false;
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

const title = fs.readFileSync(titlePath, "utf8");
const note = fs.readFileSync(notePath, "utf8");
const manuscript = fs
  .readFileSync(manuscriptPath, "utf8")
  .replaceAll(/^Manual Hindi\/Devanagari transliteration draft\.\n+/gm, "");
const css = fs.readFileSync(cssPath, "utf8");

const titleLines = title.trim().split("\n").map((line) => line.trim()).filter(Boolean);
const titleHtml = `
<section class="title-page">
  <h1>${inline(titleLines[0].replace(/^#\s+/, ""))}</h1>
  <p class="subtitle">${inline(titleLines[1] ?? "")}</p>
  <p class="author">${inline(titleLines[2]?.replace(/^Author:\s*/, "") ?? "")}</p>
</section>`;

const noteHtml = note.trim()
  ? `<section class="publishing-note">${markdownToHtml(note)}</section>`
  : "";
const manuscriptHtml = markdownToHtml(manuscript);

const document = `<!doctype html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>इख़्तियाराते मुस्तफ़ा ﷺ</title>
  <style>${css}</style>
</head>
<body>
  <main class="book">
    ${titleHtml}
    ${noteHtml}
    ${manuscriptHtml}
  </main>
</body>
</html>
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, document, "utf8");
console.log(`Wrote ${path.relative(root, outPath)}`);

async function writePdf({ outputPath, headerTemplate, footerTemplate, margin }) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(outPath).href, { waitUntil: "networkidle" });
  await page.pdf({
    path: outputPath,
    format: "A5",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate,
    footerTemplate,
    margin,
  });
  await browser.close();
  console.log(`Wrote ${path.relative(root, outputPath)}`);
}

function addText(zip, filePath, text) {
  zip.addFile(filePath, Buffer.from(text, "utf8"));
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
    .replaceAll("padding: 46px 56px 64px;", "padding: 0;");

  addText(zip, "OEBPS/styles/book.css", epubCss);
  addText(zip, "OEBPS/nav.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="hi">
<head><title>Contents</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body><nav epub:type="toc"><h1>Contents</h1><ol><li><a href="book.xhtml">इख़्तियाराते मुस्तफ़ा ﷺ</a></li></ol></nav></body>
</html>`);
  addText(zip, "OEBPS/book.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="hi">
<head><title>इख़्तियाराते मुस्तफ़ा ﷺ</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body><main class="book">${titleHtml}${noteHtml}${manuscriptHtml}</main></body>
</html>`);
  addText(zip, "OEBPS/package.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="hi">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:islamic-knowledge:ikhteyarate-mustafa-hindi</dc:identifier>
    <dc:title>इख़्तियाराते मुस्तफ़ा ﷺ</dc:title>
    <dc:language>hi</dc:language>
    <dc:creator>Imran Raza Attari</dc:creator>
    <dc:publisher>Islamic Knowledge</dc:publisher>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, "Z")}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="book" href="book.xhtml" media-type="application/xhtml+xml"/>
    <item id="css" href="styles/book.css" media-type="text/css"/>
  </manifest>
  <spine>
    <itemref idref="book"/>
  </spine>
</package>`);
  zip.writeZip(epubPath);
  console.log(`Wrote ${path.relative(root, epubPath)}`);
}

await writePdf({
  outputPath: digitalPdfPath,
  headerTemplate: `<div style="font-family: serif; font-size: 8px; color: #8a7a66; width: 100%; text-align: center;">इख़्तियाराते मुस्तफ़ा ﷺ</div>`,
  footerTemplate: `<div style="font-family: serif; font-size: 8px; color: #8a7a66; width: 100%; text-align: center;"><span class="pageNumber"></span></div>`,
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
  footerTemplate: `<div style="font-family: serif; font-size: 8px; color: #8a7a66; width: 100%; text-align: center;"><span class="pageNumber"></span></div>`,
  margin: {
    top: "16mm",
    right: "18mm",
    bottom: "18mm",
    left: "18mm",
  },
});
writeEpub();
