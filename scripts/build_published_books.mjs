import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(repoRoot, "content", "published-books");

const editions = [
  {
    slug: "addawatul-makkiyyah-english",
    title: "Addawlatul Makkiyyah",
    subtitle: "English Translation",
    author: "Imam Ahmad Raza Khan Barelvi",
    language: "English",
    status: "Draft — translation in progress",
    manuscript: "publishing/addawatul-makkiyyah-english-json/manuscript",
  },
  {
    slug: "shifa-shareef-english",
    title: "Shifa Shareef",
    subtitle: "English Translation",
    author: "Imam Qadi Iyad",
    language: "English",
    status: "Draft",
    manuscript: "publishing/shifa-shareef-english/manuscript",
  },
  {
    slug: "ikhteyarate-mustafa-english",
    title: "The Power of the Last Prophet",
    subtitle: "English Translation",
    author: "Imran Raza Attari",
    language: "English",
    status: "Draft",
    manuscript: "publishing/ikhteyarate-mustafa-english/manuscript",
  },
  {
    slug: "ikhteyarate-mustafa-hindi",
    title: "Ikhteyarate Mustafa",
    subtitle: "Hindi Transliteration",
    author: "Imran Raza Attari",
    language: "Hindi",
    status: "Draft — manual transliteration in progress",
    manuscript: "publishing/ikhteyarate-mustafa-hindi/manuscript",
  },
];

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".md") && !/^(README|MIGRATION_STATUS)(\.md)?$/i.test(entry.name)) files.push(fullPath);
  }
  return files;
}

function appendRun(runs, text, marks = [], href) {
  if (!text) return;
  const previous = runs.at(-1);
  if (previous && previous.href === href && JSON.stringify(previous.marks) === JSON.stringify(marks)) {
    previous.text += text;
  } else {
    runs.push({ text, ...(marks.length ? { marks } : {}), ...(href ? { href } : {}) });
  }
}

function parseInlineMarkdown(source, inheritedMarks = [], inheritedHref) {
  const runs = [];
  let remaining = source.replace(/<br\s*\/?>/gi, "\n");

  const patterns = [
    { regex: /^\*\*([\s\S]+?)\*\*/, mark: "bold" },
    { regex: /^__([\s\S]+?)__/, mark: "bold" },
    { regex: /^\*([^*\n]+?)\*(?!\*)/, mark: "italic" },
    { regex: /^_([^_\n]+?)_(?!_)/, mark: "italic" },
    { regex: /^`([^`\n]+)`/, mark: "code" },
    { regex: /^<sup\b[^>]*>([\s\S]*?)<\/sup\s*>/i, mark: "superscript" },
    { regex: /^<sub\b[^>]*>([\s\S]*?)<\/sub\s*>/i, mark: "subscript" },
    { regex: /^<(strong|b)\b[^>]*>([\s\S]*?)<\/\1\s*>/i, markFrom: "bold", contentGroup: 2 },
    { regex: /^<(em|i)\b[^>]*>([\s\S]*?)<\/\1\s*>/i, markFrom: "italic", contentGroup: 2 },
    { regex: /^\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/, link: true },
    { regex: /^<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a\s*>/i, htmlLink: true },
  ];

  while (remaining.length) {
    let matched = false;
    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (!match) continue;
      if (pattern.link) {
        for (const run of parseInlineMarkdown(match[1], inheritedMarks, match[2])) appendRun(runs, run.text, run.marks ?? inheritedMarks, run.href ?? match[2]);
      } else if (pattern.htmlLink) {
        for (const run of parseInlineMarkdown(match[2], inheritedMarks, match[1])) appendRun(runs, run.text, run.marks ?? inheritedMarks, run.href ?? match[1]);
      } else {
        const mark = pattern.mark ?? (match[1] === "strong" || match[1] === "b" ? "bold" : "italic");
        const content = pattern.contentGroup ? match[pattern.contentGroup] : match[1];
        const marks = [...inheritedMarks, mark];
        for (const run of parseInlineMarkdown(content, marks, inheritedHref)) appendRun(runs, run.text, run.marks ?? marks, run.href ?? inheritedHref);
      }
      remaining = remaining.slice(match[0].length);
      matched = true;
      break;
    }
    if (matched) continue;

    const nextMarker = ["*", "_", "`", "<", "["].map((marker) => remaining.indexOf(marker)).filter((index) => index > 0).sort((a, b) => a - b)[0];
    const plainLength = nextMarker ?? (remaining[0] === "*" || remaining[0] === "_" || remaining[0] === "`" || remaining[0] === "<" || remaining[0] === "[" ? 1 : remaining.length);
    appendRun(runs, remaining.slice(0, plainLength), inheritedMarks, inheritedHref);
    remaining = remaining.slice(plainLength);
  }
  return runs;
}

function plainText(runs) {
  return runs.map((run) => run.text).join("").trim();
}

function cleanInlineMarkdown(value) {
  return plainText(parseInlineMarkdown(value));
}

function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-|-$/g, "") || "section";
}

function parseMarkdown(source, fallbackTitle) {
  const blocks = [];
  let sectionTitle = "";
  let sectionTitleRuns = [];
  let paragraph = [];
  let quote = [];
  let list = [];
  let listType = "unordered";

  const flushParagraph = () => {
    const runs = parseInlineMarkdown(paragraph.join("\n"));
    const text = plainText(runs);
    if (text) blocks.push({ blockType: "content", text, runs });
    paragraph = [];
  };
  const flushQuote = () => {
    const runs = parseInlineMarkdown(quote.join("\n"));
    const text = plainText(runs);
    if (text) blocks.push({ blockType: "quote", text, runs });
    quote = [];
  };
  const flushList = () => {
    const items = list.map((item) => {
      const runs = parseInlineMarkdown(item.text);
      return { marker: item.marker, text: plainText(runs), runs };
    }).filter((item) => item.text);
    const text = items.map((item) => `${item.marker} ${item.text}`).join("\n");
    if (text) blocks.push({ blockType: "list", listType, text, items });
    list = [];
  };
  const flushAll = () => { flushParagraph(); flushQuote(); flushList(); };

  for (const line of source.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flushAll();
      const title = cleanInlineMarkdown(heading[2]);
      const titleRuns = parseInlineMarkdown(heading[2]);
      if (!sectionTitle) { sectionTitle = title; sectionTitleRuns = titleRuns; }
      else blocks.push({ blockType: "heading", text: title, runs: titleRuns });
      continue;
    }
    if (/^\s*---+\s*$/.test(line)) { flushAll(); continue; }

    const quoteLine = line.match(/^\s*>\s?(.*)$/);
    if (quoteLine) {
      flushParagraph();
      flushList();
      quote.push(quoteLine[1]);
      continue;
    }

    const listLine = line.match(/^\s*((?:[-*+]\s+)|(?:\d+[.)]\s+))(.*)$/);
    if (listLine) {
      flushParagraph();
      flushQuote();
      const nextListType = /^\d/.test(listLine[1]) ? "ordered" : "unordered";
      if (list.length && listType !== nextListType) flushList();
      listType = nextListType;
      list.push({ marker: nextListType === "ordered" ? listLine[1].trim() : "•", text: listLine[2] });
      continue;
    }

    if (!line.trim()) { flushAll(); continue; }
    flushQuote();
    flushList();
    paragraph.push(line.trim());
  }
  flushAll();
  return { title: sectionTitle || fallbackTitle, titleRuns: sectionTitleRuns, blocks };
}

async function buildEdition(edition) {
  const manuscriptDirectory = path.join(repoRoot, edition.manuscript);
  const files = await markdownFiles(manuscriptDirectory);
  if (!files.length) throw new Error(`No manuscript Markdown found for ${edition.slug}`);

  const sections = [];
  for (const file of files) {
    const relativeSource = path.relative(repoRoot, file).split(path.sep).join("/");
    const parsed = parseMarkdown(await readFile(file, "utf8"), path.basename(file, ".md").replace(/^\d+-/, "").replaceAll("-", " "));
    if (!parsed.blocks.length && !parsed.title) continue;
    sections.push({
      sectionNo: sections.length + 1,
      slug: slugify(path.basename(file, ".md")),
      title: parsed.title,
      titleRuns: parsed.titleRuns,
      sourceFile: relativeSource,
      blocks: parsed.blocks,
    });
  }

  const book = {
    schemaVersion: 2,
    slug: edition.slug,
    title: edition.title,
    subtitle: edition.subtitle,
    author: edition.author,
    language: edition.language,
    editionStatus: edition.status,
    sourceType: "publishing-markdown",
    sections,
  };
  await writeFile(path.join(outputDirectory, `${edition.slug}.json`), `${JSON.stringify(book)}\n`, "utf8");
  console.log(`${edition.slug}: ${sections.length} manuscript files → sections`);
}

await mkdir(outputDirectory, { recursive: true });
for (const edition of editions) await buildEdition(edition);
