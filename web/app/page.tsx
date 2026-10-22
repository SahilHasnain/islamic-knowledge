import Link from "next/link";
import { getBookCover, getBookDescription, getBooks } from "@/lib/books";
import LibraryCollection, { type LibraryBook } from "./library-collection";
import HomeScreenScrollbar from "./home-screen-scrollbar";

export default function Home() {
  const sourceBooks = getBooks();
  const books: LibraryBook[] = sourceBooks.map((book) => ({
    slug: book.slug,
    title: book.title,
    cover: getBookCover(book),
    author: book.author || "A work of Islamic knowledge",
    language: book.language || "Islamic literature",
    pageCount: book.pageCount,
    description: getBookDescription(book),
    sectionTitles: (book.sections ?? []).map((section) => section.title ?? ""),
  }));
  const featuredBook = books[0];

  return (
    <main className="home-main min-h-screen bg-background text-foreground">
      <HomeScreenScrollbar />
      <header className="site-header home-header" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: "var(--background)" }}>
        <Link className="brand" href="/" aria-label="Dar al-Kutub home"><span className="brand-mark">د</span><span>dar al-kutub</span></Link>
        <span className="header-note">A quiet place for knowledge</span>
        <a className="header-link" href="#collection">The collection <span>↘</span></a>
      </header>
      <div className="home-header-spacer" aria-hidden="true" style={{ height: 76 }} />

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> THE DIGITAL ISLAMIC LIBRARY</p>
          <h1>Knowledge worth<br /><em>returning to.</em></h1>
          <p className="hero-description">A considered collection of Islamic books, ready to be explored at your own pace.</p>
          <a className="primary-link" href="#collection">Explore the library <span>↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun-disc" />
          <div className="arch arch-outer"><div className="arch arch-inner"><div className="arch-book"><span>۞</span><i /></div></div></div>
          <span className="art-caption">READ · REFLECT · RETURN</span>
          <span className="art-star">✳</span>
        </div>
        <div className="hero-bottom"><span>EST. IN THE SPIRIT OF SEEKING</span><span>01 — THE LIBRARY</span></div>
      </section>

      {featuredBook && <section className="featured-section" aria-labelledby="featured-title">
        <div className="featured-art"><div className="featured-cover"><img src={featuredBook.cover} alt="" /></div><span className="featured-art-label">A BOOK TO RETURN TO</span></div>
        <div className="featured-copy"><p className="eyebrow"><span className="eyebrow-line" /> SELECTED FOR YOU</p><h2 id="featured-title">A place to <em>begin.</em></h2><p className="featured-label">FEATURED BOOK</p><h3>{featuredBook.title}</h3><p className="featured-author">{featuredBook.author} · {featuredBook.language}</p><p className="featured-description">{featuredBook.description}</p><Link className="primary-link" href={`/books/${featuredBook.slug}`}>Start reading <span>↗</span></Link></div>
      </section>}

      <LibraryCollection books={books} />
      <footer className="site-footer"><Link className="brand" href="/"><span className="brand-mark">د</span><span>dar al-kutub</span></Link><span>Made for the love of knowledge.</span><a href="#collection">BACK TO TOP ↑</a></footer>
    </main>
  );
}
