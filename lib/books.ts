import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type BookPage = {
  pageNumber: number;
  text: string;
  characterCount: number;
};

export type BookTableOfContentsEntry = {
  title: string;
  printedPageNumber: number;
  pdfPageNumber: number;
};

export type FormattedBookPage = {
  pageNumber: number;
  printedPageNumber: number;
  text: string;
  paragraphs: string[];
};

export type BookSection = {
  slug: string;
  title: string;
  startPageNumber: number;
  endPageNumber: number;
  printedPageNumber: number;
  paragraphCount: number;
  pages: FormattedBookPage[];
};

export type Book = {
  slug: string;
  title: string;
  author: string;
  language: string;
  sourceFile: string;
  extractedWith: string;
  extractedAt: string;
  pageCount: number;
  totalCharacterCount: number;
  pages: BookPage[];
  tableOfContents?: BookTableOfContentsEntry[];
  sections?: BookSection[];
};

const booksDirectory = path.join(process.cwd(), "content", "books");

export function getBooks(): Book[] {
  if (!existsSync(booksDirectory)) {
    return [];
  }

  return readdirSync(booksDirectory)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => getBookBySlug(fileName.replace(/\.json$/, "")))
    .filter((book): book is Book => Boolean(book))
    .sort((first, second) => first.title.localeCompare(second.title));
}

export function getBookBySlug(slug: string): Book | null {
  const filePath = path.join(booksDirectory, `${slug}.json`);

  if (!existsSync(filePath)) {
    return null;
  }

  return JSON.parse(readFileSync(filePath, "utf-8")) as Book;
}

export function getBookSection(bookSlug: string, sectionSlug: string) {
  const book = getBookBySlug(bookSlug);

  if (!book) {
    return null;
  }

  const section = book.sections?.find((item) => item.slug === sectionSlug);

  if (!section) {
    return null;
  }

  return {
    book,
    section,
    sections: book.sections ?? [],
  };
}

export function getAuthors() {
  const authors = new Map<string, { name: string; books: Book[] }>();

  for (const book of getBooks()) {
    const existing = authors.get(book.author) ?? { name: book.author, books: [] };
    existing.books.push(book);
    authors.set(book.author, existing);
  }

  return Array.from(authors.values()).sort((first, second) =>
    first.name.localeCompare(second.name),
  );
}
