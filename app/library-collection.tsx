"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type LibraryBook = {
  slug: string;
  title: string;
  cover?: string;
  author: string;
  language: string;
  pageCount?: number;
  description: string;
  sectionTitles: string[];
};

type Props = { books: LibraryBook[] };
type RecentBook = { slug: string; updatedAt: number; progress: number };

function BookMark({ index }: { index: number }) {
  return <div className={`book-mark book-mark-${index % 5}`} aria-hidden="true"><span>۞</span></div>;
}

function BookCard({ book, index }: { book: LibraryBook; index: number }) {
  return (
    <Link className="book-card" href={`/books/${book.slug}`}>
      <div className="book-card-art">{book.cover ? <img className="book-cover" src={book.cover} alt="" /> : <BookMark index={index} />}<span className="card-open" aria-hidden="true">↗</span><span className="book-language">{book.language}</span></div>
      <div className="book-card-info"><div><h3>{book.title}</h3><p>{book.author}</p></div><span className="card-arrow">→</span></div>
      <p className="book-description">{book.description}</p>
    </Link>
  );
}

export default function LibraryCollection({ books }: Props) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);
  const languages = useMemo(() => Array.from(new Set(books.map((book) => book.language).filter(Boolean))).sort(), [books]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const recent = books.flatMap((book) => {
        try {
          const lastRead = localStorage.getItem(`dar-al-kutub:last-read:${book.slug}`);
          if (!lastRead) return [];
          const { updatedAt } = JSON.parse(lastRead) as { updatedAt?: number };
          const savedPosition = localStorage.getItem(`dar-al-kutub:reader-position:${book.slug}`);
          const { progress = 0 } = savedPosition ? JSON.parse(savedPosition) as { progress?: number } : {};
          return typeof updatedAt === "number" ? [{ slug: book.slug, updatedAt, progress }] : [];
        } catch {
          return [];
        }
      }).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
      setRecentBooks(recent);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [books]);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredBooks = books.filter((book) => {
    const matchesLanguage = language === "all" || book.language === language;
    const searchable = [book.title, book.author, book.language, ...book.sectionTitles].join(" ").toLocaleLowerCase();
    return matchesLanguage && (!normalizedQuery || searchable.includes(normalizedQuery));
  });

  return (
    <>
      {recentBooks.length > 0 && <section className="recent-section" aria-labelledby="recent-heading">
        <div className="recent-heading"><div><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2 id="recent-heading">Recently <em>read.</em></h2></div></div>
        <div className="recent-grid">
          {recentBooks.map((recent) => {
            const book = books.find((item) => item.slug === recent.slug);
            if (!book) return null;
            return <Link className="recent-card" href={`/books/${book.slug}`} key={book.slug}>
              {book.cover ? <img className="recent-cover" src={book.cover} alt="" /> : <BookMark index={books.findIndex((item) => item.slug === book.slug)} />}
              <span className="recent-card-copy"><strong>{book.title}</strong><span>{recent.progress}% read</span><span className="recent-progress"><i style={{ width: `${recent.progress}%` }} /></span></span>
              <span className="recent-arrow" aria-hidden="true">↗</span>
            </Link>;
          })}
        </div>
      </section>}

      <section className="collection-section" aria-labelledby="collection-heading">
        <div className="section-heading"><div><p className="eyebrow">A GROWING COLLECTION</p><h2 id="collection-heading">Find your next <em>read.</em></h2></div><span className="book-count">{String(filteredBooks.length).padStart(2, "0")} <span>BOOKS</span></span></div>
        <div className="library-filters">
          <label className="search-field"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, authors, or topics" aria-label="Search books by title, author, or topic" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}</label>
          <label className="language-filter"><span>LANGUAGE</span><select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Filter books by language"><option value="all">All languages</option>{languages.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </div>
        {filteredBooks.length ? <div className="book-grid">
          {filteredBooks.map((book) => <BookCard book={book} index={books.indexOf(book)} key={book.slug} />)}
        </div> : <div className="empty-library"><p>No books match that search.</p><button type="button" onClick={() => { setQuery(""); setLanguage("all"); }}>Clear filters</button></div>}
      </section>
    </>
  );
}
