import * as cheerio from "cheerio";
import {
  Document, Packer, Paragraph, TextRun,
  HeadingLevel, AlignmentType, BorderStyle,
  TabStopType,
} from "docx";

export default async function htmlToDocx(html, theme) {
  const t = Object.assign({
    accent: "1A4C7A", accentWarm: "8B3A2A", ink: "17130F",
    muted: "6F6252", gold: "B8944F",
    bodyFont: "Georgia", arabicFont: "Noto Naskh Arabic",
    bodySize: 22, h1Size: 48, h2Size: 34, h3Size: 26,
    poetrySize: 20, referenceSize: 18,
    lineHeight: 1.65,
  }, theme);

  const $ = cheerio.load(html);
  const children = [];
  const visited = new Set();

  function collectRuns(el) {
    const runs = [];
    const nodes = el.childNodes ? [...el.childNodes] : [];
    for (const node of nodes) {
      if (node.type === "text") {
        const text = node.data.replace(/\s+/g, " ");
        if (!text.trim()) continue;
        runs.push({ text, font: t.bodyFont, size: t.bodySize });
      } else if (node.type === "tag") {
        const $n = $(node);
        const tag = node.tagName;
        if (tag === "br") {
          runs.push({ break: 1, font: t.bodyFont, size: t.bodySize });
        } else if (tag === "strong" || tag === "b") {
          for (const r of collectRuns(node)) runs.push({ ...r, bold: true });
        } else if (tag === "em" || tag === "i") {
          for (const r of collectRuns(node)) runs.push({ ...r, italics: true });
        } else if (tag === "sup") {
          for (const r of collectRuns(node)) {
            runs.push({ ...r, superScript: true, font: t.arabicFont, size: Math.round((r.size || t.bodySize) * 0.72), rightToLeft: true });
          }
        } else if (tag === "span") {
          const cls = $n.attr("class") || "";
          for (const r of collectRuns(node)) {
            if (cls.includes("arabic")) runs.push({ ...r, font: t.arabicFont, rightToLeft: true });
            else if (cls.includes("reference")) runs.push({ ...r, color: hex(t.muted), italics: true, size: t.referenceSize });
            else runs.push(r);
          }
        } else {
          for (const r of collectRuns(node)) runs.push(r);
        }
      }
    }
    return runs;
  }

  function isArabic(text) {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
  }

  function hex(c) {
    if (typeof c === "object") return ((c[0] << 16) | (c[1] << 8) | c[2]).toString(16).padStart(6, "0");
    return c;
  }

  function toRuns(arr) {
    return arr.map(r => {
      if (r.text && isArabic(r.text) && !r.rightToLeft) {
        return new TextRun({ ...r, rightToLeft: true });
      }
      return new TextRun(r);
    });
  }

  function mkHeading(level, hp, color, runs) {
    return new Paragraph({
      heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: Math.round(hp * 1.6), after: Math.round(hp * 0.7) },
      children: toRuns(runs.map(r => ({ ...r, size: hp, bold: true, color: hex(color), font: r.font || t.bodyFont }))),
    });
  }

  function processElement(el) {
    if (visited.has(el)) return;
    visited.add(el);

    const $el = $(el);
    const tag = el.tagName;
    const cls = $el.attr("class") || "";

    if (tag === "section" && cls.includes("title-page")) {
      const title = $el.find("h1");
      if (title.length) children.push(mkHeading(1, 48, t.accentWarm, collectRuns(title[0])));
      $el.find(".subtitle, .author, .translator").each((_, e) => {
        const $e = $(e);
        const runs = collectRuns(e);
        const hp = $e.hasClass("subtitle") ? 20 : $e.hasClass("author") ? 22 : 18;
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 160, after: 160 },
          children: toRuns(runs.map(r => ({ ...r, size: hp }))),
        }));
      });
      return;
    }

    if (cls.includes("publishing-note")) {
      children.push(new Paragraph({
        spacing: { before: 160, after: 280 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: hex(t.muted) } },
        children: toRuns(collectRuns(el).map(r => ({ ...r, color: hex(t.muted), size: t.referenceSize }))),
      }));
      return;
    }

    if (cls.includes("toc-row")) {
      const titleEl = $el.find(".toc-title");
      const pagesEl = $el.find(".toc-pages");
      const titleRuns = titleEl.length ? collectRuns(titleEl[0]) : collectRuns(el);
      const isMajor = cls.includes("toc-major");
      children.push(new Paragraph({
        spacing: { before: 20, after: 20 },
        tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
        children: [
          ...toRuns(titleRuns.map(r => ({
            ...r,
            bold: isMajor ? true : r.bold,
            color: isMajor ? hex(t.accent) : r.color,
            size: Math.round(px2hp(20, t)),
          }))),
          new TextRun({ text: "\t", font: t.bodyFont, size: Math.round(px2hp(18, t)) }),
          ...(pagesEl.length ? toRuns(collectRuns(pagesEl[0]).map(r => ({
            ...r, color: hex(t.muted), size: Math.round(px2hp(18, t)),
          }))) : []),
        ],
      }));
      return;
    }

    if (tag === "h1") { children.push(mkHeading(1, t.h1Size, t.accent, collectRuns(el))); return; }
    if (tag === "h2") { children.push(mkHeading(2, t.h2Size, t.accent, collectRuns(el))); return; }
    if (tag === "h3") { children.push(mkHeading(3, t.h3Size, t.accentWarm, collectRuns(el))); return; }

    if (tag === "p" && cls.includes("reference")) {
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: Math.round(px2hp(8, t)), after: Math.round(px2hp(20, t)) },
        children: toRuns(collectRuns(el).map(r => ({ ...r, color: hex(t.muted), italics: true, size: t.referenceSize }))),
      }));
      return;
    }

    if (tag === "blockquote") {
      $el.find("p").each((_, p) => {
        children.push(new Paragraph({
          indent: { left: Math.round(px2hp(28, t)) },
          spacing: { before: Math.round(px2hp(6, t)), after: Math.round(px2hp(6, t)) },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: hex(t.gold) } },
          children: toRuns(collectRuns(p).map(r => ({ ...r, italics: true }))),
        }));
      });
      return;
    }

    if (cls.includes("poetry")) {
      const parts = [];
      $el.contents().each((_, n) => {
        if (n.type === "text") { const text = n.data.trim(); if (text) parts.push(text); }
        else if (n.tagName === "br") parts.push("\n");
        else parts.push($(n).text().trim());
      });
      const lines = parts.join("").split("\n");
      const runs = lines.flatMap((line, i) => [
        new TextRun({ text: line, font: t.bodyFont, size: t.poetrySize, italics: true, color: hex(t.accent) }),
        ...(i < lines.length - 1 ? [new TextRun({ break: 1, font: t.bodyFont, size: t.poetrySize })] : []),
      ]);
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: Math.round(px2hp(20, t)), after: Math.round(px2hp(28, t)) },
        children: runs,
      }));
      return;
    }

    if (tag === "ul") {
      $el.find("li").each((_, li) => {
        children.push(new Paragraph({
          bullet: { level: 0 },
          spacing: { before: Math.round(px2hp(4, t)), after: Math.round(px2hp(4, t)) },
          children: toRuns(collectRuns(li)),
        }));
      });
      return;
    }

    if (tag === "hr") {
      children.push(new Paragraph({
        spacing: { before: Math.round(px2hp(28, t)), after: Math.round(px2hp(28, t)) },
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: hex(t.muted) } },
        children: [],
      }));
      return;
    }

    if (tag === "p") {
      children.push(new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: Math.round(px2hp(18, t)) },
        children: toRuns(collectRuns(el)),
      }));
      return;
    }
  }

  function px2hp(px, t) {
    return Math.round((px / 15) * t.bodySize);
  }

  $("main.book > section, main.book > p, main.book > h1, main.book > h2, main.book > h3, main.book > blockquote, main.book > div, main.book > ul, main.book > hr, .publishing-note").each((_, el) => {
    processElement(el);
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: t.bodyFont, size: t.bodySize },
          paragraph: { spacing: { line: Math.round(240 * t.lineHeight) } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1280, bottom: 1600, left: 1280 },
        },
      },
      children,
    }],
  });

  return await Packer.toBuffer(doc);
}
