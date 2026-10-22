import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type TextMark = "bold" | "italic" | "code" | "superscript" | "subscript";
export type TextRun = { text: string; marks?: TextMark[]; href?: string };
export type BookListItem = { marker?: string; text: string; runs?: TextRun[] };
export type BookBlock = {
  sequenceNo?: number;
  blockType?: string;
  text?: string;
  runs?: TextRun[];
  items?: BookListItem[];
  listType?: "ordered" | "unordered";
  pdfPage?: number;
  printedPage?: number;
};
export type BookSection = { sectionNo?: number; slug?: string; title?: string; titleRuns?: TextRun[]; blocks?: BookBlock[] };
export type Book = {
  slug: string;
  title: string;
  author?: string;
  language?: string;
  subtitle?: string;
  editionStatus?: string;
  pageCount?: number;
  toc?: { title?: string; printedPage?: number }[];
  sections?: BookSection[];
};

const booksDirectories = [
  path.resolve(process.cwd(), "../content/books"),
  path.resolve(process.cwd(), "../content/published-books"),
];

function readBooksFrom(directory: string): Book[] {
  return readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(readFileSync(path.join(directory, file), "utf8")) as Book)
    .filter((book) => book.slug && book.title);
}

export function getBooks(): Book[] {
  return booksDirectories.flatMap(readBooksFrom)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getBook(slug: string): Book | undefined {
  for (const directory of booksDirectories) {
    const candidate = path.join(directory, `${slug}.json`);
    if (existsSync(candidate)) {
      const book = JSON.parse(readFileSync(candidate, "utf8")) as Book;
      if (book.slug === slug) return book;
    }
  }
  return getBooks().find((book) => book.slug === slug);
}

export function getBookDescription(book: Book): string {
  const firstText = book.sections?.flatMap((section) => section.blocks ?? []).find((block) => block.text?.trim())?.text;
  return firstText?.replace(/\s+/g, " ").trim().slice(0, 150) || `${book.language || "A treasured work"} · ${book.pageCount ? `${book.pageCount} pages` : "Read in the library"}`;
}
