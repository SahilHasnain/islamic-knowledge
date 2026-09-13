import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const BASE_URL = "https://allamaiqbal.org/bal-e-jibril/";
const OUT_PATH = path.join(process.cwd(), "content", "books", "bal-e-jibreel.json");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const DELAY_MS = 400;
const MAX_RETRIES = 3;

async function fetchHtml(url, attempt = 1) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    if (attempt >= MAX_RETRIES) throw err;
    await sleep(DELAY_MS * 1.5 * attempt);
    return fetchHtml(url, attempt + 1);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(value) {
  return value
    .replaceAll("\r", "")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sectionKey(headingText) {
  const t = headingText.trim().toLowerCase();
  if (t === "اردو" || t === "urdu" || t === "urdu text") return "urdu";
  if (t.includes("transliteration")) return "transliteration";
  if (t.includes("tashreeh") || t.includes("explanation")) return "tashreeh";
  if (t.includes("english") || t.includes("translation")) return "english";
  if (t.includes("roman")) return "roman";
  return null;
}

function extractKalam(html) {
  const $ = cheerio.load(html);
  const sections = { urdu: [], transliteration: [], english: [], tashreeh: [], roman: [] };
  let current = null;

  $(".entry-content *").each((_, el) => {
    const tag = el.tagName.toLowerCase();
    if (["h1", "h2", "h3", "h4", "h5"].includes(tag)) {
      const key = sectionKey($(el).text());
      if (key) current = key;
      return;
    }
    if (tag === "pre") {
      $(el).find("br").replaceWith("\n");
      $(el).find("br").replaceWith("\n");
      const text = normalizeText($(el).text());
      if (text && current) sections[current].push(text);
    }
  });

  const opened = {};
  for (const [key, parts] of Object.entries(sections)) {
    const joined = parts.join("\n\n");
    if (joined) opened[key] = joined;
  }

  const titleUrdu = normalizeText($(".entry-content h1").first().text());
  const titleRoman = normalizeText($(".entry-content p.uagb-desc-text").first().text());

  return {
    slug: null,
    title_urdu: titleUrdu,
    title_roman: titleRoman,
    url: null,
    ...opened,
  };
}

async function collectKalamLinks() {
  const html = await fetchHtml(BASE_URL);
  const $ = cheerio.load(html);
  const seen = new Set();
  const links = [];

  $('a[href*="/bal-e-jibril/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const match = href.match(/^https:\/\/allamaiqbal\.org\/bal-e-jibril\/([a-z0-9-]+)\/$/);
    if (!match) return;
    if (seen.has(href)) return;
    seen.add(href);
    links.push({ url: href, slug: match[1] });
  });

  return links;
}

async function main() {
  const links = await collectKalamLinks();
  console.log(`Found ${links.length} kalam links.`);

  const kalams = [];
  let failures = 0;

  for (let i = 0; i < links.length; i++) {
    const { url, slug } = links[i];
    try {
      const html = await fetchHtml(url);
      const kalam = extractKalam(html);
      kalam.slug = slug;
      kalam.url = url;
      kalams.push(kalam);
      console.log(`[${i + 1}/${links.length}] ${slug}`);
    } catch (err) {
      failures++;
      console.error(`[${i + 1}/${links.length}] FAILED ${url}: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }

  if (kalams.length === 0) {
    console.error("No kalams extracted. Aborting.");
    process.exit(1);
  }

  const book = {
    slug: "bal-e-jibreel",
    title: "Bal-e-Jibreel (بال جبریل)",
    author: "Allama Muhammad Iqbal",
    language: "Urdu",
    source: BASE_URL,
    extractedAt: new Date().toISOString(),
    kalamCount: kalams.length,
    failures,
    kalams,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(book, null, 2), "utf-8");
  console.log(`\nWrote ${kalams.length} kalams to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});