import type { Metadata } from "next";
import Link from "next/link";

import { TextWithSalawat } from "@/components/text-with-salawat";
import { getBooks } from "@/lib/books";
import { createOpenGraph } from "@/lib/seo";

const booksDescription =
  "Browse Islamic books prepared for clean online reading.";

export const metadata: Metadata = {
  title: "Books",
  description: booksDescription,
  alternates: {
    canonical: "/books",
  },
  openGraph: createOpenGraph({
    title: "Books | Islamic Knowledge",
    description: booksDescription,
    path: "/books",
  }),
  twitter: {
    card: "summary_large_image",
    title: "Books | Islamic Knowledge",
    description: booksDescription,
  },
};

export default function BooksPage() {
  const books = getBooks();

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <Link className="text-sm font-semibold text-emerald-900" href="/">
          Back to home
        </Link>

        <section className="py-14">
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-none tracking-tight text-emerald-950 sm:text-6xl">
            Books
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            Choose a book and read it section by section.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-emerald-900/15 bg-white/70 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-white"
              href="/authors"
            >
              Browse authors
            </Link>
          </div>
        </section>

        <section className="grid gap-5 pb-20 md:grid-cols-2">
          {books.map((book) => (
            <Link
              className="group rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6 shadow-sm shadow-emerald-950/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
              href={`/books/${book.slug}`}
              key={book.slug}
            >
              <h2 className="font-serif text-4xl font-semibold text-emerald-950">
                <TextWithSalawat text={book.title} />
              </h2>
              <p className="mt-3 text-stone-700">{book.author}</p>
              <p className="mt-8 text-sm font-semibold text-emerald-900 transition group-hover:translate-x-1">
                Read book
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
