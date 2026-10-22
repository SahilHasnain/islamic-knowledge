import Link from "next/link";
import { getBookDescription, getBooks } from "@/lib/books";

function BookMark({ index }: { index: number }) {
  return <div className={`book-mark book-mark-${index % 5}`} aria-hidden="true"><span>۞</span></div>;
}

export default function Home() {
  const books = getBooks();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Dar al-Kutub home"><span className="brand-mark">د</span><span>dar al-kutub</span></Link>
        <span className="header-note">A quiet place for knowledge</span>
        <a className="header-link" href="#collection">The collection <span>↘</span></a>
      </header>

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

      <section id="collection" className="collection-section">
        <div className="section-heading"><div><p className="eyebrow">A GROWING COLLECTION</p><h2>Find your next <em>read.</em></h2></div><span className="book-count">{String(books.length).padStart(2, "0")} <span>BOOKS</span></span></div>
        <div className="book-grid">
          {books.map((book, index) => (
            <Link className="book-card" href={`/books/${book.slug}`} key={book.slug}>
              <div className="book-card-art"><BookMark index={index} /><span className="card-open" aria-hidden="true">↗</span><span className="book-language">{book.language || "Islamic literature"}</span></div>
              <div className="book-card-info"><div><h3>{book.title}</h3><p>{book.author || "A work of Islamic knowledge"}</p></div><span className="card-arrow">→</span></div>
              <p className="book-description">{getBookDescription(book)}</p>
            </Link>
          ))}
        </div>
      </section>
      <footer className="site-footer"><Link className="brand" href="/"><span className="brand-mark">د</span><span>dar al-kutub</span></Link><span>Made for the love of knowledge.</span><a href="#collection">BACK TO TOP ↑</a></footer>
    </main>
  );
}
