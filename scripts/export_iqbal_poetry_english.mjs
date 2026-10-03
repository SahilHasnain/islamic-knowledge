import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AdmZip from "adm-zip";
import { PDFDocument } from "pdf-lib";
import { chromium } from "playwright";
import htmlToDocx from "./html-to-docx.mjs";

const BOOKS = {
  "bal-e-jibreel": {
    project: "publishing/bal-e-jibreel-english",
    id: "bal-e-jibreel-english",
    title: "Bal-e-Jibreel",
    docTitle: "Bal-e-Jibreel",
    epubTitle: "Bal-e-Jibreel",
    ncxTitle: "Bal-e-Jibreel",
    accent: "0F5A3E",
    accentWarm: "7A3D22",
    ink: "17130F",
    muted: "6F6252",
    gold: "B8944F",
  },
  "zarb-e-kaleem": {
    project: "publishing/zarb-e-kaleem-english",
    id: "zarb-e-kaleem-english",
    title: "Zarb-e-Kaleem",
    docTitle: "Zarb-e-Kaleem",
    epubTitle: "Zarb-e-Kaleem",
    ncxTitle: "Zarb-e-Kaleem",
    accent: "0F5A3E",
    accentWarm: "7A3D22",
    ink: "17130F",
    muted: "6F6252",
    gold: "B8944F",
  },
};

const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const selected = args.length ? args.filter((b) => BOOKS[b]) : Object.keys(BOOKS);
if (args.length && selected.length !== args.length) {
  const unknown = args.filter((b) => !BOOKS[b]).join(", ");
  console.error(`Unknown book(s): ${unknown}`);
  process.exit(1);
}

const root = process.cwd();
const pdfPageSize = { width: "148mm", height: "210mm" };

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function restoreInlineHtml(value) {
  return value
    .replaceAll("&lt;sup&gt;([\\s\\S]*?)&lt;/sup&gt;", "<sup>$1</sup>")
    .replaceAll("\uFDFA", '<span class="arabic">\uFDFA</span>')
    .replaceAll(/`([^`]+)`/g, '<span class="reference">$1</span>')
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

// ---- Manuscript parsing -----------------------------------------------------

const METADATA_RE = /^\*\*([^*]+?):\*\*\s*(.*)$/;
const KALAM_HEADING_RE = /^##\s+Kalam\s+(\d+)\s*:\s*(.*)$/;

function parseKalam(lines) {
  const heading = lines[0];
  const hm = KALAM_HEADING_RE.exec(heading.trim());
  const number = hm ? hm[1] : "";
  const slug = hm ? hm[2].trim() : "";

  const rest = lines.slice(1);
  const notes = [];
  let i = 0;
  while (i < rest.length) {
    const raw = rest[i].trimEnd();
    const m = METADATA_RE.exec(raw.trim());
    if (m) {
      notes.push({ key: m[1].trim(), value: m[2].replace(/\s+$/, "") });
      i++;
      continue;
    }
    if (raw.trim() === "") {
      let j = i;
      while (j < rest.length && rest[j].trim() === "") j++;
      const next = (rest[j] ?? "").trim();
      if (next && METADATA_RE.test(next)) {
        i++;
        continue;
      }
      break;
    }
    break;
  }
  while (i < rest.length && rest[i].trim() === "") i++;

  const titleNote = notes.find((n) => n.key.toLowerCase() === "title");
  const title = titleNote ? titleNote.value : slug;
  const otherNotes =
    titleNote && titleNote.key.toLowerCase() !== "source title"
      ? notes.filter((n) => n !== titleNote)
      : notes;

  return { number, slug, heading, notes: otherNotes, title, body: rest.slice(i) };
}

function bodyToHtml(lines) {
  const html = [];
  let poetry = [];

  function flushPoetry() {
    if (poetry.length) {
      html.push(`<div class="poetry">${poetry.map(inline).join("<br>")}</div>`);
      poetry = [];
    }
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushPoetry();
      continue;
    }

    const marker = /^\((\d+)\)$/.exec(trimmed);
    if (marker) {
      flushPoetry();
      html.push(`<p class="marker">(${inline(marker[1])})</p>`);
      continue;
    }

    if (/^`[^`]+`$/.test(trimmed)) {
      flushPoetry();
      html.push(`<p class="reference">${inline(trimmed.slice(1, -1))}</p>`);
      continue;
    }

    const stage = /^\*\*([^*]+)\*\*$/.exec(trimmed);
    if (stage) {
      flushPoetry();
      html.push(`<p class="stage">${inline(stage[1])}</p>`);
      continue;
    }

    if (METADATA_RE.test(trimmed)) {
      const m = METADATA_RE.exec(trimmed);
      flushPoetry();
      html.push(`<p class="source-note"><span class="k">${inline(m[1])}:</span> ${inline(m[2])}</p>`);
      continue;
    }

    poetry.push(trimmed);
  }
  flushPoetry();
  return html.join("\n");
}

function kalamToHtml(k) {
  const title = `Kalam ${k.number}: ${k.title}`;
  const noteHtml = k.notes.length
    ? k.notes.map((n) => `<p class="source-note"><span class="k">${inline(n.key)}:</span> ${inline(n.value)}</p>`).join("\n")
    : "";
  return `<h2 data-toc-section="">${inline(title)}</h2>\n${noteHtml}${bodyToHtml(k.body)}`;
}

function parseManuscript(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const start = lines.findIndex((l) => /^##\s+Kalam\s+\d+/.test(l.trim()));
  const content = start >= 0 ? lines.slice(start) : lines;
  const blocks = [];
  let current = null;
  for (const line of content) {
    if (/^##\s+Kalam\s+\d+/.test(line.trim())) {
      if (current) blocks.push(current);
      current = [line];
    } else if (current) {
      current.push(line);
    }
  }
  if (current) blocks.push(current);
  return blocks.map(parseKalam);
}

function readManuscript(manuscriptDir) {
  const files = fs.readdirSync(manuscriptDir).filter((f) => f.endsWith(".md")).sort();
  return files
    .map((f) => fs.readFileSync(path.join(manuscriptDir, f), "utf8"))
    .join("\n\n");
}

// ---- Per-book build ---------------------------------------------------------

async function buildBook(name) {
  const cfg = BOOKS[name];
  const projectDir = path.join(root, cfg.project);
  const manuscriptDir = path.join(projectDir, "manuscript");
  const titlePath = path.join(projectDir, "layout", "title-page.md");
  const css = fs.readFileSync(path.join(projectDir, "layout", "book.css"), "utf8");
  const coverPath = path.join(projectDir, "assets", "cover.png");
  const outDir = path.join(projectDir, "exports", "html");
  const outPath = path.join(outDir, `${cfg.id}.html`);
  const pdfDir = path.join(projectDir, "exports", "pdf");
  const printDir = path.join(projectDir, "exports", "print");
  const epubDir = path.join(projectDir, "exports", "epub");
  const docxDir = path.join(projectDir, "exports", "docx");
  const digitalPdfPath = path.join(pdfDir, `${cfg.id}-digital.pdf`);
  const printPdfPath = path.join(printDir, `${cfg.id}-print.pdf`);
  const epubPath = path.join(epubDir, `${cfg.id}.epub`);

  const title = fs.readFileSync(titlePath, "utf8");
  const titleLines = title.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  const manuscript = readManuscript(manuscriptDir);
  const kalams = parseManuscript(manuscript);
  const coverDataUrl = imageDataUrl(coverPath);

  const coverHtml = `<section class="cover-page" aria-label="Book cover"><img src="${coverDataUrl}" alt="${escapeHtml(cfg.title)} cover"></section>`;
  const titleHtml = `<section class="title-page">
  <h1>${inline(titleLines[0].replace(/^#\s+/, ""))}</h1>
  <p class="subtitle">${inline(titleLines[1] ?? "")}</p>
  <p class="author">${inline(titleLines[2]?.replace(/^Author:\s+/, "") ?? "")}</p>
</section>`;

  const tocRows = kalams
    .map((k) => `<div class="toc-row toc-chapter"><span class="toc-title">${inline(`Kalam ${k.number}: ${k.title}`)}</span></div>`)
    .join("\n");
  const tocHtml = `<section class="toc-page"><h1>Contents</h1>\n${tocRows}\n</section>`;

  const manuscriptHtml = kalams.map(kalamToHtml).join("\n");

  const document = `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${escapeHtml(cfg.docTitle)}</title>\n  <style>${css}</style>\n</head>\n<body>\n  <main class="book">\n    ${coverHtml}\n    ${titleHtml}\n    ${tocHtml}\n    ${manuscriptHtml}\n  </main>\n</body>\n</html>`;

  const contentDocument = `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${escapeHtml(cfg.docTitle)}</title>\n  <style>${css}</style>\n</head>\n<body>\n  <main class="book">\n    ${titleHtml}\n    ${tocHtml}\n    ${manuscriptHtml}\n  </main>\n</body>\n</html>`;

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, document, "utf8");
  console.log(`[${name}] Wrote ${path.relative(root, outPath)}`);

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
    console.log(`[${name}] Wrote ${path.relative(root, outputPath)}`);
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
      .replaceAll("padding: 46px 56px 64px;", "padding: 1.2rem 1.15rem 1.8rem;")
      + `\n\nbody {\n  background: var(--paper);\n  margin: 0;\n}\n\n.book {\n  box-shadow: none;\n  margin: 0;\n  max-width: none;\n  min-height: auto;\n}\n\n.section-book {\n  padding-top: 1.1rem;\n}\n\n.cover-page,\n.book > .cover-page {\n  height: 100vh;\n  margin: 0;\n  padding: 0;\n}\n\n.title-page {\n  border: 2px double #5f8b75;\n  min-height: 72vh;\n}\n\n.epub-contents h1,\nnav h1 {\n  color: var(--accent);\n  font-size: 1.7rem;\n  margin: 1rem 0 1.2rem;\n  text-align: center;\n}\n\n.epub-toc,\nnav ol {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.epub-toc li,\nnav li {\n  border-bottom: 1px dotted #8aa897;\n  margin: 0;\n  padding: 0.45rem 0;\n}\n\n.epub-toc a,\nnav a {\n  color: var(--accent);\n  text-decoration: none;\n}\n\np {\n  margin-bottom: 0.85rem;\n}\n`;

    addText(zip, "OEBPS/styles/book.css", epubCss);
    zip.addFile("OEBPS/images/cover.png", fs.readFileSync(coverPath));

    const sections = [
      { title: "Title Page", file: "title.xhtml", kind: "title" },
      { title: "Contents", file: "contents.xhtml", kind: "contents" },
      ...kalams.map((k, idx) => ({
        title: `Kalam ${k.number}: ${k.title}`,
        file: `section-${String(idx + 1).padStart(2, "0")}.xhtml`,
        kind: "kalam",
        html: kalamToHtml(k),
      })),
    ];

    const navItems = sections
      .map((s) => `<li><a href="${s.file}">${escapeXml(s.title)}</a></li>`)
      .join("");
    const manifestSections = sections
      .map((s, idx) => `    <item id="section-${idx + 1}" href="${s.file}" media-type="application/xhtml+xml"/>`)
      .join("\n");
    const spineSections = sections
      .map((_, idx) => `    <itemref idref="section-${idx + 1}"/>`)
      .join("\n");
    const ncxItems = sections
      .map((s, idx) => `    <navPoint class="chapter" id="nav-${idx + 1}" playOrder="${idx + 1}">
      <navLabel><text>${escapeXml(s.title)}</text></navLabel>
      <content src="${s.file}"/>
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
    <meta name="dtb:uid" content="urn:islamic-knowledge:${cfg.id}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${escapeXml(cfg.ncxTitle)}</text></docTitle>
  <navMap>
${ncxItems}
  </navMap>
</ncx>`);
    addText(zip, "OEBPS/cover.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>Cover</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body><section class="cover-page"><img src="images/cover.png" alt="${escapeXml(cfg.title)} cover"/></section></body>
</html>`);
    addText(zip, "OEBPS/contents.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>${escapeXml(cfg.epubTitle)}</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body>${(function() {
  const rows = sections.slice(2).map((s) => `<li><a href="${s.file}">${inline(s.title)}</a></li>`).join("\n");
  return `<main class="book epub-contents"><h1>Contents</h1><ol class="epub-toc">${rows}</ol></main>`;
})()}</body>
</html>`);

    for (const section of sections) {
      let mainContent;
      if (section.kind === "title") {
        mainContent = titleHtml;
      } else if (section.kind === "contents") {
        continue;
      } else {
        mainContent = section.html;
      }
      addText(zip, `OEBPS/${section.file}`, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head><title>${escapeXml(section.title)}</title><link rel="stylesheet" href="styles/book.css" type="text/css"/></head>
<body><main class="book section-book">${mainContent}</main></body>
</html>`);
    }

    addText(zip, "OEBPS/package.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:islamic-knowledge:${cfg.id}</dc:identifier>
    <dc:title>${escapeXml(cfg.epubTitle)}</dc:title>
    <dc:language>en</dc:language>
    <dc:creator>Allama Muhammad Iqbal</dc:creator>
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
    console.log(`[${name}] Wrote ${path.relative(root, epubPath)}`);
  }

  const digitalCssOverride = `html { font-size: 16px; line-height: 1.7; }\n@media print { html { font-size: 15.5px; } }\n.title-page h1 { color: var(--accent); }`;
  const digitalContentDocument = `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${escapeHtml(cfg.docTitle)}</title>\n  <style>${css}\n${digitalCssOverride}</style>\n</head>\n<body>\n  <main class="book">\n    ${titleHtml}\n    ${tocHtml}\n    ${manuscriptHtml}\n  </main>\n</body>\n</html>`;

  await writePdf({
    outputPath: digitalPdfPath,
    headerTemplate: `<div style="box-sizing: border-box; color: #0f5a3e; font-family: Georgia, 'Times New Roman', serif; font-size: 9px; padding: 6px 16mm 0; text-align: left; width: 100%;">${escapeHtml(cfg.docTitle)}</div>`,
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
      accent: cfg.accent,
      accentWarm: cfg.accentWarm,
      ink: cfg.ink,
      muted: cfg.muted,
      gold: cfg.gold,
    });
    const docxPath = path.join(docxDir, `${cfg.id}.docx`);
    fs.writeFileSync(docxPath, buffer);
    console.log(`[${name}] Wrote ${path.relative(root, docxPath)}`);
  }

  await writeDocx();
}

for (const name of selected) {
  await buildBook(name);
}
console.log("Export complete.");