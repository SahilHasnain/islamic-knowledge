import type { ReactNode } from "react";
import type { BookListItem, TextRun } from "@/lib/books";

type InlineTextProps = { runs: TextRun[] };
type Props = {
  text: string;
  runs?: TextRun[];
  items?: BookListItem[];
  listType?: "ordered" | "unordered";
};

function safeHref(href: string): string | undefined {
  const value = href.trim();
  if (/^(https?:|mailto:|\/|#)/i.test(value) && !/^\/\//.test(value)) return value;
  return undefined;
}

function RunText({ text }: { text: string }) {
  const lines = text.split("\n");
  return <>{lines.map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>)}</>;
}

export function InlineText({ runs }: InlineTextProps) {
  return <>{runs.map((run, index) => {
    let content: ReactNode = <RunText text={run.text} />;
    for (const mark of run.marks ?? []) {
      switch (mark) {
        case "bold": content = <strong>{content}</strong>; break;
        case "italic": content = <em>{content}</em>; break;
        case "code": content = <code>{content}</code>; break;
        case "superscript": content = <sup>{content}</sup>; break;
        case "subscript": content = <sub>{content}</sub>; break;
      }
    }
    const href = run.href ? safeHref(run.href) : undefined;
    if (href) content = <a href={href} rel={/^https?:/i.test(href) ? "noreferrer" : undefined}>{content}</a>;
    return <span key={index}>{content}</span>;
  })}</>;
}

const listMarker = /^(?:•|[-–] )\s*|^\(\d+\)\s*|^\d+[.)]\s*/;

function looksLikeVerse(lines: string[]) {
  return lines.length >= 2 && lines.length <= 8 &&
    lines.every((line) => line.length > 0 && line.length <= 58 && !/[.!?؛:]$/.test(line));
}

export default function FormattedText({ text, runs, items, listType }: Props) {
  if (items?.length) {
    const List = listType === "ordered" ? "ol" : "ul";
    return <List className="reader-list">{items.map((item, index) => (
      <li key={index}>{item.runs?.length ? <InlineText runs={item.runs} /> : item.text}</li>
    ))}</List>;
  }

  if (runs?.length) {
    const content = runs.map((run) => run.text).join("");
    const lines = content.split("\n");
    const isVerse = looksLikeVerse(lines);
    const isCitation = /\([^\n()]{2,100}\)$/.test(content) && content.length < 130;
    return <div className="formatted-text"><p className={`${isVerse ? "reader-verse" : ""} ${isCitation ? "reader-citation" : ""}`.trim()}><InlineText runs={runs} /></p></div>;
  }

  // Backward-compatible rendering for the original plain-text book JSON files.
  const paragraphs = text.trim().split(/\n\s*\n+/).map((part) => part.trim()).filter(Boolean);
  return <div className="formatted-text">
    {paragraphs.map((paragraph, index) => {
      const lines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean);
      const isList = lines.length > 0 && lines.every((line) => listMarker.test(line));
      if (isList) return <ul className="reader-list" key={index}>{lines.map((line, lineIndex) => <li key={lineIndex}>{line.replace(listMarker, "")}</li>)}</ul>;
      if (looksLikeVerse(lines)) return <p className="reader-verse" key={index}>{lines.map((line, lineIndex) => <span key={lineIndex}>{line}{lineIndex < lines.length - 1 && <br />}</span>)}</p>;
      const content = lines.join(" ").replace(/\s+/g, " ");
      const isCitation = /\([^\n()]{2,100}\)$/.test(content) && content.length < 130;
      return <p className={isCitation ? "reader-citation" : undefined} key={index}>{content}</p>;
    })}
  </div>;
}
