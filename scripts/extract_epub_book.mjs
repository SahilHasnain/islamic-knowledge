import AdmZip from "adm-zip";
import { writeFileSync } from "node:fs";
import path from "node:path";

function getText(zip, entryName) {
  const entry = zip.getEntry(entryName);
  if (!entry) {
    throw new Error(`Missing EPUB entry: ${entryName}`);
  }

  return entry.getData().toString("utf8");
}

function dirname(entryName) {
  const normalized = entryName.replace(/\\/g, "/");
  const index = normalized.lastIndexOf("/");
  return index === -1 ? "" : normalized.slice(0, index + 1);
}

function joinEntry(base, relative) {
  return path.posix.normalize(`${base}${relative}`);
}

function attr(source, name) {
  const match = source.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match?.[1] ?? "";
}

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function stripHtml(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/(p|div|section|article|li|h[1-6]|blockquote)>/gi, "\n\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\r/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

function paragraphsFromHtml(html) {
  const matches = Array.from(
    html.matchAll(/<(h[1-6]|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi),
  );

  const paragraphs = matches
    .map((match) => stripHtml(match[2]))
    .filter(Boolean)
    .filter((text) => !/^\d+$/.test(text));

  if (paragraphs.length) {
    return paragraphs;
  }

  return stripHtml(html)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function headingsFromHtml(html) {
  return Array.from(html.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi))
    .map((match) => stripHtml(match[2]))
    .filter(Boolean);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

function uniqueSlug(title, used) {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;

  while (used.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  used.add(slug);
  return slug;
}

function parseArgs() {
  const args = new Map();
  for (let index = 2; index < process.argv.length; index += 2) {
    args.set(process.argv[index], process.argv[index + 1]);
  }

  for (const name of ["--epub", "--output", "--slug"]) {
    if (!args.get(name)) {
      throw new Error(`Missing required argument: ${name}`);
    }
  }

  return args;
}

const args = parseArgs();
const epubPath = args.get("--epub");
const outputPath = args.get("--output");
const zip = new AdmZip(epubPath);

const container = getText(zip, "META-INF/container.xml");
const opfPath = attr(container.match(/<rootfile\b[^>]+>/i)?.[0] ?? "", "full-path");
if (!opfPath) {
  throw new Error("Could not find EPUB OPF path");
}

const opf = getText(zip, opfPath);
const opfBase = dirname(opfPath);
const title = args.get("--title") || stripHtml(opf.match(/<dc:title\b[^>]*>([\s\S]*?)<\/dc:title>/i)?.[1] ?? "Untitled");
const author = args.get("--author") || stripHtml(opf.match(/<dc:creator\b[^>]*>([\s\S]*?)<\/dc:creator>/i)?.[1] ?? "Unknown");
const language = args.get("--language") || "Roman Urdu";

const manifest = new Map();
for (const match of opf.matchAll(/<item\b[^>]*>/gi)) {
  const tag = match[0];
  const id = attr(tag, "id");
  const href = attr(tag, "href");
  const mediaType = attr(tag, "media-type");
  if (id && href && /xhtml|html/i.test(mediaType)) {
    manifest.set(id, joinEntry(opfBase, href));
  }
}

const spineIds = Array.from(opf.matchAll(/<itemref\b[^>]*>/gi))
  .map((match) => attr(match[0], "idref"))
  .filter(Boolean);

const pages = [];
const sections = [];
const tableOfContents = [];
const usedSlugs = new Set();

for (const id of spineIds) {
  const entryName = manifest.get(id);
  if (!entryName) {
    continue;
  }

  const html = getText(zip, entryName);
  const paragraphs = paragraphsFromHtml(html);
  const text = paragraphs.join("\n\n");
  if (!text) {
    continue;
  }

  const pageNumber = pages.length + 1;
  pages.push({ pageNumber, text, characterCount: text.length });

  const heading = headingsFromHtml(html)[0] || paragraphs[0]?.slice(0, 80) || `Section ${pageNumber}`;
  const title = heading.replace(/\s+/g, " ").trim();
  tableOfContents.push({ title, printedPageNumber: pageNumber, pdfPageNumber: pageNumber });
  sections.push({
    slug: uniqueSlug(title, usedSlugs),
    title,
    startPageNumber: pageNumber,
    endPageNumber: pageNumber,
    printedPageNumber: pageNumber,
    paragraphCount: paragraphs.length,
    pages: [{ pageNumber, printedPageNumber: pageNumber, text, paragraphs }],
  });
}

const book = {
  slug: args.get("--slug"),
  title,
  author,
  language,
  sourceFile: path.basename(epubPath),
  extractedWith: "EPUB spine extractor",
  extractedAt: new Date().toISOString(),
  pageCount: pages.length,
  totalCharacterCount: pages.reduce((total, page) => total + page.characterCount, 0),
  pages,
  tableOfContents,
  sections,
};

writeFileSync(outputPath, `${JSON.stringify(book, null, 2)}\n`, "utf8");
console.log(`Extracted ${book.pageCount} spine items and ${book.totalCharacterCount} characters to ${outputPath}`);
