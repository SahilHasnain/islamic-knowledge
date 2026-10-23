import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, getBooks } from "@/lib/books";
import FormattedText, { InlineText } from "./formatted-text";
import ReaderExperience from "./reader-experience";

type Props = { params: Promise<{ slug: string }> };

// This reader resolves the selected book from the URL before rendering its content.
export const instant = false;

export function generateStaticParams() {
  return getBooks().map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  return { title: book ? `${book.title} — Darul Kutub` : "Book not found" };
}

export default async function BookReader({ params }: Props) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const sections = book.sections ?? [];

  return (
    <ReaderExperience slug={book.slug}>
      <div className="reader-layout">
        <aside className="reader-sidebar">
          <p className="eyebrow">IN THIS BOOK</p>
          <h2>{book.title}</h2>
          <p className="sidebar-meta">{book.author || "A work of Islamic knowledge"}</p>
          <nav aria-label="Book contents" className="contents-list">
            {sections.map((section, index) => (
              <a key={`${section.slug ?? section.sectionNo}-${index}`} href={`#section-${index + 1}`} className="contents-link"><span className="contents-number">{String(index + 1).padStart(2, "0")}</span><span>{section.title || `Section ${index + 1}`}</span></a>
            ))}
          </nav>
          <div className="reader-sidebar-foot">{book.language || "Islamic literature"}{book.pageCount ? ` · ${book.pageCount} pages` : ""}</div>
        </aside>

        <article className="reader-content">
          <div className="reader-intro"><p className="eyebrow">A BOOK TO SPEND TIME WITH</p><h1>{book.title}</h1><p className="reader-byline">{book.subtitle ? `${book.subtitle} · ` : ""}{book.author || "A work of Islamic knowledge"}</p><div className="reader-rule"><span>۞</span></div></div>
          {sections.map((section, index) => (
            <section id={`section-${index + 1}`} className="reader-section" key={`${section.slug ?? section.sectionNo}-${index}`}>
              <div className="reader-section-heading"><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.titleRuns?.length ? <InlineText runs={section.titleRuns} /> : section.title || `Section ${index + 1}`}</h2></div>
              {(section.blocks ?? []).map((block, blockIndex) => block.text?.trim() ? (
                <div key={blockIndex} className={`reader-block ${block.blockType === "heading" ? "reader-block-heading" : ""}`}>
                  {block.blockType === "heading" ? <h3>{block.runs?.length ? <InlineText runs={block.runs} /> : block.text}</h3> : block.blockType === "quote" ? <blockquote className="reader-quote"><FormattedText text={block.text} runs={block.runs} /></blockquote> : <FormattedText text={block.text} runs={block.runs} items={block.items} listType={block.listType} />}
                </div>
              ) : null)}
            </section>
          ))}
          {!sections.length && <p className="empty-reader">The text for this book has not been added yet.</p>}
          <div className="reader-end"><span>۞</span><p>May this knowledge bring benefit.</p><Link href="/">Return to the library <span>↗</span></Link></div>
        </article>
      </div>
    </ReaderExperience>
  );
}
