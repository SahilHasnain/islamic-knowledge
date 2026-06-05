import type { Metadata } from "next";
import Link from "next/link";

import { TextWithSalawat } from "@/components/text-with-salawat";
import { getBooks } from "@/lib/books";
import { createOpenGraph, siteConfig } from "@/lib/seo";

const homeDescription =
  "Read Islamic books online in a clean, structured library built for focused study.";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: createOpenGraph({
    title: siteConfig.name,
    description: homeDescription,
    path: "/",
  }),
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: homeDescription,
  },
};

const steps = [
  {
    title: "Choose a book",
    description:
      "Open the library and select from the available Islamic books.",
  },
  {
    title: "Read by section",
    description:
      "Each book is split into clear sections with a book-wide contents sidebar.",
  },
  {
    title: "Find through search",
    description:
      "Every book and section has its own crawlable page for search engines.",
  },
];

export default function Home() {
  const books = getBooks();
  const featuredBook = books[0];

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <a href="#top" className="group flex items-center gap-3" aria-label="Islamic Knowledge home">
          <span className="grid size-11 place-items-center rounded-2xl border border-emerald-900/10 bg-white/80 text-lg font-semibold text-emerald-950 shadow-sm shadow-emerald-950/5">
            IK
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-900/70">
              Islamic
            </span>
            <span className="font-serif text-2xl font-semibold tracking-tight text-emerald-950">
              Knowledge
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 md:flex">
          <Link className="transition hover:text-emerald-900" href="/books">
            Books
          </Link>
          <Link className="transition hover:text-emerald-900" href="/authors">
            Authors
          </Link>
          <a className="transition hover:text-emerald-900" href="#featured">
            Featured
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="relative mx-auto w-full max-w-5xl px-5 pb-16 pt-12 text-center sm:px-8 lg:pb-20 lg:pt-20">
          <div className="absolute left-1/2 top-0 -z-10 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />
          <p className="mx-auto mb-5 w-fit rounded-full border border-emerald-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm shadow-emerald-950/5">
            Islamic books for focused reading
          </p>
          <h1 className="mx-auto max-w-4xl font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-emerald-950 sm:text-6xl lg:text-7xl">
            Read Islamic books online, section by section.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
            This site turns Islamic books from PDFs into clean, readable web
            pages so readers and search engines can find the exact section they
            need.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-950 px-6 text-sm font-semibold text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-900"
              href="/books"
            >
              Browse Books
            </Link>
            {featuredBook ? (
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-900/15 bg-white/70 px-6 text-sm font-semibold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-white"
                href={`/books/${featuredBook.slug}`}
              >
                Read Featured Book
              </Link>
            ) : null}
          </div>
        </section>

        {featuredBook ? (
          <section id="featured" className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
            <div className="rounded-[2rem] border border-emerald-950/10 bg-white/85 p-6 shadow-xl shadow-emerald-950/5 sm:p-8">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-800">
                    Start Here
                  </p>
                  <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">
                    <TextWithSalawat text={featuredBook.title} />
                  </h2>
                  <p className="mt-4 text-lg text-stone-700">{featuredBook.author}</p>
                  <p className="mt-6 max-w-2xl leading-8 text-stone-700">
                    The book is available as structured sections with a contents
                    sidebar for easy navigation.
                  </p>
                </div>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-950 px-6 text-sm font-semibold text-white transition hover:bg-emerald-900"
                  href={`/books/${featuredBook.slug}`}
                >
                  Read Book
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:pb-24">
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article
                className="rounded-3xl border border-emerald-950/10 bg-white/75 p-6 shadow-sm shadow-emerald-950/5"
                key={step.title}
              >
                <h2 className="font-serif text-3xl font-semibold text-emerald-950">
                  {step.title}
                </h2>
                <p className="mt-4 leading-7 text-stone-700">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link className="text-sm font-semibold text-emerald-900" href="/authors">
              Browse authors
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-950/10 px-5 py-8 text-center text-sm text-stone-600 sm:px-8">
        Islamic Knowledge. A growing library of Islamic books.
      </footer>
    </div>
  );
}
