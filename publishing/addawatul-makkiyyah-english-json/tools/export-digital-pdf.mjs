import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import htmlToDocx from "../../../scripts/html-to-docx.mjs";
import { deflateRawSync } from "node:zlib";

const root = process.cwd();
const projectDir = path.join(root, "publishing", "addawatul-makkiyyah-english-json");
const manuscriptDir = path.join(projectDir, "manuscript");
const layoutDir = path.join(projectDir, "layout");
const config = JSON.parse(fs.readFileSync(path.join(layoutDir, "export-config.json"), "utf8"));
const themeCss = fs.readFileSync(path.join(layoutDir, config.theme), "utf8");
const htmlDir = path.join(projectDir, "exports", "html");
const pdfDir = path.join(projectDir, "exports", "pdf");
const epubDir = path.join(projectDir, "exports", "epub");
const docxDir = path.join(projectDir, "exports", "docx");
const htmlPath = path.join(htmlDir, "addawatul-makkiyyah-english-digital.html");
const pdfPath = path.join(pdfDir, "addawatul-makkiyyah-english-digital.pdf");
const epubPath = path.join(epubDir, "addawatul-makkiyyah-english.epub");
const docxPath = path.join(docxDir, "addawatul-makkiyyah-english.docx");

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\[\^(\d+)\]/g, '<sup class="footnote-ref"><a href="#footnote-$1">$1</a></sup>');
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/([\u0600-\u06ff][\u0600-\u06ff\u064b-\u065f\u0670\u06d6-\u06ed\s]*)/g,
    (match) => `<span class="arabic" lang="ar" dir="rtl">${match}</span>`);
  return out;
}

function slugify(text) {
  return text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
}

function getHeadings(markdown, prefix) {
  const counts = new Map();
  return [...markdown.matchAll(/^(#{1,4})\s+(.+)$/gm)].map((match) => {
    const level = match[1].length;
    const title = match[2].trim();
    const base = `${prefix}-${slugify(title)}`;
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return { level, title, id: count ? `${base}-${count + 1}` : base };
  });
}

function walkMarkdown(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdown(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(full);
  }
  return files;
}

const markdownFiles = walkMarkdown(manuscriptDir);
if (!markdownFiles.length) throw new Error(`No manuscript Markdown found in ${manuscriptDir}`);

const sections = [];
for (const file of markdownFiles) {
  const rel = path.relative(manuscriptDir, file).replaceAll(path.sep, "/");
  const text = fs.readFileSync(file, "utf8").replaceAll("\r\n", "\n");
  const anchorPrefix = slugify(rel.replace(/\.md$/i, ""));
  const headings = getHeadings(text, anchorPrefix);
  sections.push({ rel, text, headings, html: markdownToHtml(text, headings) });
}

function markdownToHtml(markdown, headings) {
  const lines = markdown.split("\n");
  const html = [];
  let para = [];
  let quote = [];
  let listType = null;
  let listItems = [];
  let poetry = [];
  let headingIndex = 0;

  const closePara = () => { if (para.length) { html.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const closeQuote = () => { if (quote.length) { html.push(`<blockquote>${quote.map(x => `<p>${inline(x)}</p>`).join("")}</blockquote>`); quote = []; } };
  const closeList = () => {
    if (listItems.length) {
      const tag = listType === "ol" ? "ol" : "ul";
      html.push(`<${tag}>${listItems.map(x => `<li>${inline(x)}</li>`).join("")}</${tag}>`);
      listItems = []; listType = null;
    }
  };
  const closePoetry = () => { if (poetry.length) { html.push(`<div class="poetry">${poetry.map(inline).join("<br>")}</div>`); poetry = []; } };
  const closeBlocks = () => { closePara(); closeQuote(); closeList(); closePoetry(); };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const t = line.trim();
    if (!t) { closeBlocks(); continue; }
    const heading = /^(#{1,4})\s+(.+)$/.exec(t);
    if (heading) {
      closeBlocks();
      const level = heading[1].length;
      const id = headings[headingIndex++]?.id ?? `section-${html.length}`;
      html.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`);
      continue;
    }
    const footnote = /^\[\^(\d+)\]:\s*(.*)$/.exec(t);
    if (footnote) {
      closeBlocks();
      html.push(`<aside class="footnote" id="footnote-${footnote[1]}"><sup>${footnote[1]}</sup> ${inline(footnote[2])}</aside>`);
      continue;
    }
    if (t === "---") { closeBlocks(); html.push("<hr>"); continue; }
    if (t.startsWith("> ")) {
      closePara(); closeList(); closePoetry();
      quote.push(t.slice(2));
      continue;
    }
    if (/^[-*]\s+/.test(t) || /^\d+[.)]\s+/.test(t)) {
      closePara(); closeQuote(); closePoetry();
      const type = /^\d+[.)]\s+/.test(t) ? "ol" : "ul";
      if (listType && listType !== type) closeList();
      listType = type;
      listItems.push(t.replace(/^([-*]|\d+[.)])\s+/, ""));
      continue;
    }
    closeQuote(); closeList();
    if (t.endsWith("\\")) { closePara(); poetry.push(t.slice(0, -1)); continue; }
    closePoetry();
    para.push(t);
  }
  closeBlocks();
  return html.join("\n");
}

const toc = sections.flatMap(section => section.headings.filter(h => h.level <= 2));

const tocHtml = `<nav class="contents"><h1>Contents</h1><ol>${toc.map(x => `<li><a href="#${x.id}">${inline(x.title)}</a></li>`).join("\n")}</ol></nav>`;
const titleHtml = `<section class="title-page"><div class="title-ornament">✦　✦　✦</div><h1>${escapeHtml(config.title)}</h1><p class="subtitle">${escapeHtml(config.subtitle)}</p><p class="author">${escapeHtml(config.author)}</p><p class="edition-note">${escapeHtml(config.editionNote)}</p></section>`;
const bodyHtml = sections.map(s => `<section class="manuscript-section" data-source-file="${escapeHtml(s.rel)}">${s.html}</section>`).join("\n");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(config.title)} — Digital English Edition</title><style>${themeCss}</style></head><body><main class="book">${titleHtml}${tocHtml}${bodyHtml}</main></body></html>`;

fs.mkdirSync(htmlDir, { recursive: true });
fs.mkdirSync(pdfDir, { recursive: true });
fs.mkdirSync(epubDir, { recursive: true });
fs.mkdirSync(docxDir, { recursive: true });
fs.writeFileSync(htmlPath, html, "utf8");

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.pdf({
    path: pdfPath,
    format: config.pdf.format,
    printBackground: true,
    preferCSSPageSize: true,
    tagged: config.pdf.tagged,
    outline: config.pdf.outline,
    margin: config.pdf.margin,
  });
  await page.close();
} finally {
  await browser.close();
}

function xmlEscape(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function makeZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const time = 0;
  const date = 0x21; // 1980-01-01, the earliest DOS ZIP date.

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data, "utf8");
    const method = entry.store ? 0 : 8;
    const compressed = method === 0 ? data : deflateRawSync(data);
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(method, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);

    offset += local.length + name.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

function writeEpub() {
  const entries = [{ name: "mimetype", data: "application/epub+zip", store: true }];
  entries.push({ name: "META-INF/container.xml", data: `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>` });

  const epubCss = themeCss
    .replace(/@page\s*\{[^}]*\}\s*/g, "")
    .replace(/@media screen\s*\{[\s\S]*?^\}\s*/gm, "")
    + "\n.book{max-width:none;margin:0;padding:1rem;box-shadow:none}.title-page{min-height:75vh;padding:1.5rem}.manuscript-section{padding:0 0.2rem}.contents{break-after:page}\n";
  entries.push({ name: "OEBPS/styles/warm-amber.css", data: epubCss });

  const navItems = toc.map(item => `<li><a href="text/book.xhtml#${xmlEscape(item.id)}">${inline(item.title)}</a></li>`).join("\n");
  entries.push({ name: "OEBPS/nav.xhtml", data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en"><head><title>Contents</title><link rel="stylesheet" href="styles/warm-amber.css" type="text/css"/></head><body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${navItems}</ol></nav></body></html>` });

  entries.push({ name: "OEBPS/text/book.xhtml", data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><title>${xmlEscape(config.title)}</title><link rel="stylesheet" href="../styles/warm-amber.css" type="text/css"/></head><body><main class="book">${titleHtml}${tocHtml}${bodyHtml}</main></body></html>` });

  const modified = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  entries.push({ name: "OEBPS/package.opf", data: `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="en"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="bookid">urn:islamic-knowledge:addawatul-makkiyyah-english-json</dc:identifier><dc:title>${xmlEscape(config.title)} — ${xmlEscape(config.subtitle)}</dc:title><dc:language>en</dc:language><dc:creator>${xmlEscape(config.author)}</dc:creator><meta property="dcterms:modified">${modified}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="book" href="text/book.xhtml" media-type="application/xhtml+xml"/><item id="css" href="styles/warm-amber.css" media-type="text/css"/></manifest><spine><itemref idref="book"/></spine></package>` });
  fs.writeFileSync(epubPath, makeZip(entries));
}

async function writeDocx() {
  const buffer = await htmlToDocx(html, {
    accent: "A95F13",
    accentWarm: "79400D",
    ink: "342719",
    muted: "75634B",
    gold: "C58B2E",
  });
  fs.writeFileSync(docxPath, buffer);
}

writeEpub();
await writeDocx();

console.log(`Wrote ${path.relative(root, htmlPath)}`);
console.log(`Wrote ${path.relative(root, pdfPath)}`);
console.log(`Wrote ${path.relative(root, epubPath)}`);
console.log(`Wrote ${path.relative(root, docxPath)}`);
