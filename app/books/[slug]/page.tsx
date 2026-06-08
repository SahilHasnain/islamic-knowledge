import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookSidebar } from "@/components/book-sidebar";
import { TextWithSalawat } from "@/components/text-with-salawat";
import { getBookBySlug, getBooks } from "@/lib/books";
import { getAuthorSlug } from "@/lib/taxonomy";
import { absoluteUrl, createMetaDescription, createOpenGraph } from "@/lib/seo";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getBooks().map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    return {
      title: "Book Not Found | Islamic Knowledge",
    };
  }

  const description = createMetaDescription(
    `Read ${book.title} by ${book.author} in clear sections for focused study.`,
  );
  const path = `/books/${book.slug}`;

  return {
    title: book.title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: createOpenGraph({
      title: `${book.title} | Islamic Knowledge`,
      description,
      path,
      type: "article",
    }),
    twitter: {
      card: "summary_large_image",
      title: `${book.title} | Islamic Knowledge`,
      description,
    },
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const sections = book.sections ?? [];
  const authorPath = `/authors/${getAuthorSlug(book.author)}`;
  const bookJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Book",
      name: book.title,
      author: {
        "@type": "Person",
        name: book.author,
        url: absoluteUrl(authorPath),
      },
      inLanguage: book.language,
      isAccessibleForFree: true,
      numberOfPages: book.pageCount,
      url: absoluteUrl(`/books/${book.slug}`),
      mainEntityOfPage: absoluteUrl(`/books/${book.slug}`),
      hasPart: sections.map((section, index) => ({
        "@type": "Chapter",
        name: section.title,
        position: index + 1,
        url: absoluteUrl(`/books/${book.slug}/sections/${section.slug}`),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Books",
          item: absoluteUrl("/books"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: book.title,
          item: absoluteUrl(`/books/${book.slug}`),
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bookJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <Link className="text-sm font-semibold text-emerald-900" href="/books">
            Back to books
          </Link>
          <Link className="text-sm font-semibold text-emerald-900" href="/">
            Home
          </Link>
        </div>

        <header className="py-14">
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-none tracking-tight text-emerald-950 sm:text-6xl">
            <TextWithSalawat text={book.title} />
          </h1>
          <p className="mt-5 text-xl text-stone-700">
            <Link className="font-semibold text-emerald-900" href={authorPath}>
              {book.author}
            </Link>
          </p>
        </header>

        <div className="grid gap-8 pb-20 lg:grid-cols-[18rem_1fr] lg:items-start">
          <BookSidebar book={book} sections={sections} />

          <div className="grid gap-6">
            {sections.length > 0
              ? sections.map((section, index) => (
                  <Link
                    className="rounded-[1.75rem] border border-emerald-950/10 bg-white/90 p-5 shadow-sm shadow-emerald-950/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10 sm:p-7"
                    href={`/books/${book.slug}/sections/${section.slug}`}
                    id={`section-${index + 1}`}
                    key={`${section.title}-${section.printedPageNumber}-${index}`}
                  >
                    <h2 className="font-serif text-3xl font-semibold leading-tight text-emerald-950">
                      <TextWithSalawat text={section.title} />
                    </h2>
                    <p className="mt-4 text-sm font-semibold text-emerald-900">
                      Read section
                    </p>
                  </Link>
                ))
              : book.pages.map((page) => (
                  <section
                    className="rounded-[1.5rem] border border-emerald-950/10 bg-white/85 p-5 shadow-sm shadow-emerald-950/5 sm:p-7"
                    id={`page-${page.pageNumber}`}
                    key={page.pageNumber}
                  >
                    <div className="mb-5 flex items-center justify-between gap-3 border-b border-emerald-950/10 pb-4">
                      <h2 className="font-serif text-2xl font-semibold text-emerald-950">
                        Page {page.pageNumber}
                      </h2>
                    </div>
                    {page.text ? (
                      <div className="whitespace-pre-wrap text-base leading-8 text-stone-800" dir="auto">
                        {page.text}
                      </div>
                    ) : (
                      <p className="text-stone-500">
                        No extractable text found on this page.
                      </p>
                    )}
                  </section>
                ))}
          </div>
        </div>
      </article>
    </main>
  );
}
