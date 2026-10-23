import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { deflateRawSync } from "node:zlib";
import { chromium } from "playwright";
import htmlToDocx from "../../../scripts/html-to-docx.mjs";

const root = process.cwd();
const projectDir = path.join(root, "publishing", "siratul-jinan-english");
const config = JSON.parse(fs.readFileSync(path.join(projectDir, "layout", "export-config.json"), "utf8"));
const manuscriptPath = path.join(projectDir, "manuscript", "12-surah-al-fatihah", "01-surah-al-fatihah-english-01.md");
const markdown = fs.readFileSync(manuscriptPath, "utf8")
  .replaceAll("\r\n", "\n")
  .replaceAll("Kanz-ul-Iman English translation:", "Translation:");
const css = fs.readFileSync(path.join(projectDir, "layout", config.theme), "utf8");
const exportsDir = path.join(projectDir, "exports");
const outputs = {
  html: path.join(exportsDir, "html", "siratul-jinan-al-fatihah-english-digital.html"),
  pdf: path.join(exportsDir, "pdf", "siratul-jinan-al-fatihah-english-digital.pdf"),
  epub: path.join(exportsDir, "epub", "siratul-jinan-al-fatihah-english.epub"),
  docx: path.join(exportsDir, "docx", "siratul-jinan-al-fatihah-english.docx"),
};

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function inline(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/([\u0600-\u06ff][\u0600-\u06ff\u064b-\u065f\u0670\u06d6-\u06ed\s]*)/g,
      (match) => `<span class="arabic" lang="ar" dir="rtl">${match}</span>`);
}

function renderMarkdown(source) {
  const html = [];
  let paragraph = [];
  let listTag = "";
  const flushParagraph = () => {
    if (paragraph.length) html.push(`<p>${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => { if (listTag) html.push(`</${listTag}>`); listTag = ""; };

  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (!line) { flushParagraph(); closeList(); continue; }
    if (/^\*\*(?:Source|Metadata):\*\*/i.test(line)) { flushParagraph(); closeList(); continue; }
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph(); closeList();
      const level = heading[1].length;
      const id = `h-${heading[2].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
      html.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`);
      continue;
    }
    if (line === "---") { flushParagraph(); closeList(); html.push("<hr>"); continue; }
    const item = /^(\d+\.|[-*])\s+(.+)$/.exec(line);
    if (item) {
      flushParagraph();
      const tag = /^\d/.test(item[1]) ? "ol" : "ul";
      if (listTag !== tag) { closeList(); html.push(`<${tag}>`); listTag = tag; }
      html.push(`<li>${inline(item[2])}</li>`);
      continue;
    }
    closeList();
    paragraph.push(line);
  }
  flushParagraph(); closeList();
  return html.join("\n");
}

const titleHtml = `<section class="title-page"><div class="title-ornament">✦　✦　✦</div><h1>${escapeHtml(config.title)}</h1><p>${escapeHtml(config.subtitle)}</p></section>`;
const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
const tocHtml = `<nav class="contents"><h1>Contents</h1><ol>${headings.map((heading) => {
  const id = `h-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  return `<li><a href="#${id}">${escapeHtml(heading)}</a></li>`;
}).join("\n")}</ol></nav>`;
const bodyHtml = renderMarkdown(markdown);
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(config.title)}</title><style>${css}</style></head><body><main class="book">${titleHtml}${tocHtml}${bodyHtml}</main></body></html>`;

for (const output of Object.values(outputs)) fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(outputs.html, html, "utf8");

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.pdf({ path: outputs.pdf, format: config.pdf.format, printBackground: true,
    preferCSSPageSize: true, tagged: config.pdf.tagged, outline: config.pdf.outline,
    margin: config.pdf.margin });
  await page.close();
} finally {
  await browser.close();
}

const epubEntries = [{ name: "mimetype", data: "application/epub+zip", store: true }];
epubEntries.push({ name: "META-INF/container.xml", data: '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>' });
epubEntries.push({ name: "OEBPS/styles/book.css", data: css });
const chapterTitles = headings.map((heading, index) => ({
  title: heading,
  file: `chapter-${String(index + 1).padStart(2, "0")}.xhtml`,
}));
const chapterParts = markdown.split(/(?=^##\s+)/m).filter((part) => /^##\s+/.test(part));
const navItems = chapterTitles.map((item) => `<li><a href="${item.file}">${escapeHtml(item.title)}</a></li>`).join("");
epubEntries.push({ name: "OEBPS/nav.xhtml", data: `<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en"><head><title>Contents</title><link rel="stylesheet" href="styles/book.css"/></head><body><nav epub:type="toc"><h1>Contents</h1><ol>${navItems}</ol></nav></body></html>` });
epubEntries.push({ name: "OEBPS/title.xhtml", data: `<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><title>${escapeHtml(config.title)}</title><link rel="stylesheet" href="styles/book.css"/></head><body>${titleHtml}</body></html>` });
chapterParts.forEach((part, index) => {
  const title = chapterTitles[index].title;
  const chapterHtml = `<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><title>${escapeHtml(title)}</title><link rel="stylesheet" href="styles/book.css"/></head><body><main class="book">${renderMarkdown(part)}</main></body></html>`;
  epubEntries.push({ name: `OEBPS/${chapterTitles[index].file}`, data: chapterHtml });
});
const manifest = chapterTitles.map((item, index) => `<item id="chapter-${index + 1}" href="${item.file}" media-type="application/xhtml+xml"/>`).join("");
const spine = chapterTitles.map((_, index) => `<itemref idref="chapter-${index + 1}"/>`).join("");
epubEntries.push({ name: "OEBPS/package.opf", data: `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="en"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="bookid">urn:islamic-knowledge:siratul-jinan-al-fatihah-english</dc:identifier><dc:title>${escapeHtml(config.title)}</dc:title><dc:language>en</dc:language><dc:creator>${escapeHtml(config.author)}</dc:creator><meta property="dcterms:modified">2026-10-23T00:00:00Z</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="title" href="title.xhtml" media-type="application/xhtml+xml"/><item id="css" href="styles/book.css" media-type="text/css"/>${manifest}</manifest><spine><itemref idref="title"/><itemref idref="nav"/>${spine}</spine></package>` });

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let value = n;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  crcTable[n] = value >>> 0;
}
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function makeEpubZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const data = Buffer.from(entry.data, "utf8");
    const method = entry.store ? 0 : 8;
    const compressed = method === 0 ? data : deflateRawSync(data);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(method, 8); local.writeUInt16LE(0, 10); local.writeUInt16LE(0x21, 12);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(compressed.length, 18); local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26); local.writeUInt16LE(0, 28);
    localParts.push(local, name, compressed);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(method, 10); central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0x21, 14); central.writeUInt32LE(crc, 16); central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(data.length, 24); central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42); centralParts.push(central, name);
    offset += local.length + name.length + compressed.length;
  }
  const directory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, directory, end]);
}
fs.writeFileSync(outputs.epub, makeEpubZip(epubEntries));

const docx = await htmlToDocx(html, { accent: "79400D", accentWarm: "A95F13", ink: "342719", muted: "75634B", gold: "C58B2E" });
fs.writeFileSync(outputs.docx, docx);
for (const output of Object.values(outputs)) console.log(`Wrote ${path.relative(root, output)}`);
