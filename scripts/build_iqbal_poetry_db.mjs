import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const inputDir = path.join(root, "content", "books");
const outputPath = path.join(root, "db", "iqbal-poetry.db");
const bookFiles = [
  "bal-e-jibreel.json",
  "zarb-e-kaleem.json",
  "armaghan-e-hijaz.json",
];

const db = new DatabaseSync(outputPath);

try {
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(`
    DROP TABLE IF EXISTS kalams;
    DROP TABLE IF EXISTS books;

    CREATE TABLE books (
      id INTEGER PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      language TEXT NOT NULL,
      source_url TEXT NOT NULL,
      extracted_at TEXT NOT NULL,
      kalam_count INTEGER NOT NULL CHECK (kalam_count >= 0)
    );

    CREATE TABLE kalams (
      id INTEGER PRIMARY KEY,
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      position INTEGER NOT NULL CHECK (position > 0),
      slug TEXT NOT NULL,
      title_urdu TEXT NOT NULL,
      title_roman TEXT NOT NULL,
      url TEXT NOT NULL,
      urdu TEXT NOT NULL,
      transliteration TEXT NOT NULL,
      tashreeh TEXT,
      english TEXT,
      roman TEXT,
      UNIQUE (book_id, slug),
      UNIQUE (book_id, position)
    );

    CREATE INDEX kalams_book_position_idx ON kalams(book_id, position);
    CREATE INDEX kalams_slug_idx ON kalams(slug);
  `);

  const insertBook = db.prepare(`
    INSERT INTO books
      (slug, title, author, language, source_url, extracted_at, kalam_count)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertKalam = db.prepare(`
    INSERT INTO kalams
      (book_id, position, slug, title_urdu, title_roman, url, urdu,
       transliteration, tashreeh, english, roman)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const bookId = db.prepare("SELECT id FROM books WHERE slug = ?");

  db.exec("BEGIN");
  for (const fileName of bookFiles) {
    const filePath = path.join(inputDir, fileName);
    const book = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const kalams = book.kalams ?? [];
    const author = book.author ?? "Allama Muhammad Iqbal";
    const language = book.language ?? "Urdu";

    insertBook.run(
      book.slug,
      book.title,
      author,
      language,
      book.source ?? book.url,
      book.extractedAt,
      kalams.length,
    );

    const { id } = bookId.get(book.slug);
    kalams.forEach((kalam, index) => {
      insertKalam.run(
        id,
        index + 1,
        kalam.slug,
        kalam.title_urdu,
        kalam.title_roman,
        kalam.url,
        kalam.urdu,
        kalam.transliteration,
        kalam.tashreeh ?? null,
        kalam.english ?? null,
        kalam.roman ?? null,
      );
    });
  }
  db.exec("COMMIT");

  const counts = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM books) AS books,
      (SELECT COUNT(*) FROM kalams) AS kalams
  `).get();
  console.log(`Wrote ${counts.books} books and ${counts.kalams} kalams to ${outputPath}`);
} catch (error) {
  try {
    db.exec("ROLLBACK");
  } catch {
    // The transaction may not have started.
  }
  throw error;
} finally {
  db.close();
}
