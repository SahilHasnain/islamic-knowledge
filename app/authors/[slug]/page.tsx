import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TextWithSalawat } from "@/components/text-with-salawat";
import { getAuthors } from "@/lib/books";
import { absoluteUrl, createMetaDescription, createOpenGraph } from "@/lib/seo";
import { getAuthorSlug } from "@/lib/taxonomy";

type AuthorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

function getAuthorBySlug(slug: string) {
  return getAuthors().find((author) => getAuthorSlug(author.name) === slug) ?? null;
}

export function generateStaticParams() {
  return getAuthors().map((author) => ({ slug: getAuthorSlug(author.name) }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "Author Not Found | Islamic Knowledge",
    };
  }

  const description = createMetaDescription(
    `Read Islamic books by ${author.name} in the Islamic Knowledge library.`,
  );
  const path = `/authors/${slug}`;

  return {
    title: author.name,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: createOpenGraph({
      title: `${author.name} | Islamic Knowledge`,
      description,
      path,
      type: "article",
    }),
    twitter: {
      card: "summary_large_image",
      title: `${author.name} | Islamic Knowledge`,
      description,
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: absoluteUrl(`/authors/${slug}`),
    mainEntityOfPage: absoluteUrl(`/authors/${slug}`),
    workExample: author.books.map((book) => ({
      "@type": "Book",
      name: book.title,
      url: absoluteUrl(`/books/${book.slug}`),
    })),
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto w-full max-w-7xl">
        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-emerald-900">
          <Link href="/">Home</Link>
          <span className="text-stone-400">/</span>
          <Link href="/authors">Authors</Link>
        </nav>

        <section className="py-14">
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-none tracking-tight text-emerald-950 sm:text-6xl">
            {author.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            Books by this author.
          </p>
        </section>

        <section className="grid gap-5 pb-20 md:grid-cols-2">
          {author.books.map((book) => (
            <Link
              className="rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6 shadow-sm shadow-emerald-950/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
              href={`/books/${book.slug}`}
              key={book.slug}
            >
              <h2 className="font-serif text-4xl font-semibold text-emerald-950">
                <TextWithSalawat text={book.title} />
              </h2>
              <p className="mt-4 text-sm font-semibold text-emerald-900">Read book</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
