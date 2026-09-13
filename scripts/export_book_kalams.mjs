import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const DELAY_MS = 400;
const MAX_RETRIES = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  const sections = { urdu: [], transliteration: [], tashreeh: [], english: [], roman: [] };
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
      const text = normalizeText($(el).text());
      if (text && current) sections[current].push(text);
    }
  });

  const title_urdu = normalizeText($(".entry-content h1").first().text());
  const title_roman = normalizeText($(".entry-content p.uagb-desc-text").first().text());

  const kalam = { title_urdu, title_roman };
  for (const key of ["urdu", "transliteration", "tashreeh", "english", "roman"]) {
    const joined = sections[key].join("\n\n");
    if (joined) kalam[key] = joined;
  }
  return kalam;
}

async function collectKalamLinks(indexUrl, bookPath) {
  const html = await fetchHtml(indexUrl);
  const $ = cheerio.load(html);
  const seen = new Set();
  const links = [];

  $('a[href*="/' + bookPath + '/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const match = href.match(new RegExp("^https?://[^/]+/" + bookPath + "/([a-z0-9-]+)/$"));
    if (!match) return;
    if (seen.has(href)) return;
    seen.add(href);
    links.push({ url: href, slug: match[1] });
  });

  return links;
}

const [, , bookArg] = process.argv;
const book = bookArg || "zarb-e-kaleem";

const config = {
  "bal-e-jibril": { out: "content/books/bal-e-jibreel.json", title: "Bal-e-Jibreel (بال جبریل)", previous: "bal-e-jibreel" },
  "zarb-e-kaleem": { out: "content/books/zarb-e-kaleem.json", title: "Zarb-e-Kaleem (ضرب کلیم)", previous: "zarb-e-kaleem" },
  "armaghan-e-hijaz": { out: "content/books/armaghan-e-hijaz.json", title: "Armaghan-e-Hijaz (ارمغان حجاز)", previous: "armaghan-e-hijaz" },
};

if (!config[book]) {
  console.error(`Unknown book "${book}". Expected one of: ${Object.keys(config).join(", ")}`);
  process.exit(1);
}

const cfg = config[book];
const BASE_URL = "https://allamaiqbal.org/" + cfg.previous + "/";
const OUT_PATH = path.join(process.cwd(), cfg.out);

async function main() {
  const links = await collectKalamLinks(BASE_URL, cfg.previous);
  console.log(`Found ${links.length} kalams with published pages.`);

  const kalams = [];
  const failures = [];

  for (let i = 0; i < links.length; i++) {
    const { url, slug } = links[i];
    try {
      const html = await fetchHtml(url);
      const uri = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      const kalam = extractKalam(html);
      kalam.slug = slug;
      kalam.url = url;
      kalam.uri = uri;
      if (kalam.urdu) {
        kalams.push(kalam);
      } else {
        failures.push({ slug, url, reason: "no urdu text" });
      }
      console.log(`[${i + 1}/${links.length}] ${slug}`);
    } catch (err) {
      failures.push({ slug, url, reason: String(err.message || err) });
      console.error(`[${i + 1}/${links.length}] FAILED ${url}: ${err.message || err}`);
    }
    await sleep(DELAY_MS);
  }

  if (kalams.length === 0) {
    console.error("No kalams extracted. Aborting.");
    process.exit(1);
  }

  const bookJson = {
    slug: cfg.previous,
    title: cfg.title,
    url: BASE_URL,
    extractedAt: new Date().toISOString(),
    kalamCount: kalams.length,
    kalams,
  };

  if (failures.length) bookJson.failures = failures;
  fs.writeFileSync(OUT_PATH, JSON.stringify(bookJson, null, 2), "utf-8");
  console.log(`\nWrote ${kalams.length} kalams to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
