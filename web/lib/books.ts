import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type BookBlock = { sequenceNo?: number; blockType?: string; text?: string; pdfPage?: number; printedPage?: number };
export type BookSection = { sectionNo?: number; slug?: string; title?: string; blocks?: BookBlock[] };
export type Book = {
  slug: string;
  title: string;
  author?: string;
  language?: string;
  pageCount?: number;
  toc?: { title?: string; printedPage?: number }[];
  sections?: BookSection[];
};

const booksDirectory = path.resolve(process.cwd(), "../content/books");

export function getBooks(): Book[] {
  return readdirSync(booksDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(readFileSync(path.join(booksDirectory, file), "utf8")) as Book)
    .filter((book) => book.slug && book.title)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getBook(slug: string): Book | undefined {
  return getBooks().find((book) => book.slug === slug);
}

export function getBookDescription(book: Book): string {
  const firstText = book.sections?.flatMap((section) => section.blocks ?? []).find((block) => block.text?.trim())?.text;
  return firstText?.replace(/\s+/g, " ").trim().slice(0, 150) || `${book.language || "A treasured work"} · ${book.pageCount ? `${book.pageCount} pages` : "Read in the library"}`;
}
