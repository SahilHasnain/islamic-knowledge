import type { Metadata } from "next";
import Link from "next/link";

import { getAuthors } from "@/lib/books";
import { createOpenGraph } from "@/lib/seo";
import { getAuthorSlug } from "@/lib/taxonomy";

const description =
  "Browse authors represented in the Islamic Knowledge library.";

export const metadata: Metadata = {
  title: "Authors",
  description,
  alternates: {
    canonical: "/authors",
  },
  openGraph: createOpenGraph({
    title: "Authors | Islamic Knowledge",
    description,
    path: "/authors",
  }),
  twitter: {
    card: "summary_large_image",
    title: "Authors | Islamic Knowledge",
    description,
  },
};

export default function AuthorsPage() {
  const authors = getAuthors();

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <Link className="text-sm font-semibold text-emerald-900" href="/">
          Back to home
        </Link>

        <section className="py-14">
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-none tracking-tight text-emerald-950 sm:text-6xl">
            Authors
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            Browse books by author.
          </p>
        </section>

        <section className="grid gap-5 pb-20 md:grid-cols-2">
          {authors.map((author) => (
            <Link
              className="rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6 shadow-sm shadow-emerald-950/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
              href={`/authors/${getAuthorSlug(author.name)}`}
              key={author.name}
            >
              <h2 className="font-serif text-4xl font-semibold text-emerald-950">
                {author.name}
              </h2>
              <p className="mt-4 text-stone-700">
                {author.books.length} {author.books.length === 1 ? "book" : "books"} available
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
