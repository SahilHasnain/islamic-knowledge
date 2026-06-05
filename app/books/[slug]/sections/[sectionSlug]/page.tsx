import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookSidebar } from "@/components/book-sidebar";
import { TextWithSalawat } from "@/components/text-with-salawat";
import { getBookSection, getBooks } from "@/lib/books";
import { absoluteUrl, createMetaDescription, createOpenGraph } from "@/lib/seo";

type SectionPageProps = {
  params: Promise<{
    slug: string;
    sectionSlug: string;
  }>;
};

export function generateStaticParams() {
  return getBooks().flatMap((book) =>
    (book.sections ?? []).map((section) => ({
      slug: book.slug,
      sectionSlug: section.slug,
    })),
  );
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { slug, sectionSlug } = await params;
  const result = getBookSection(slug, sectionSlug);

  if (!result) {
    return {
      title: "Section Not Found | Islamic Knowledge",
    };
  }

  const { book, section } = result;
  const firstParagraph = section.pages
    .flatMap((page) => page.paragraphs)
    .find(Boolean);
  const description = createMetaDescription(
    firstParagraph ?? `Read ${section.title} from ${book.title} by ${book.author}.`,
  );
  const path = `/books/${book.slug}/sections/${section.slug}`;

  return {
    title: `${section.title} - ${book.title}`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: createOpenGraph({
      title: `${section.title} | ${book.title}`,
      description,
      path,
      type: "article",
    }),
    twitter: {
      card: "summary_large_image",
      title: `${section.title} | ${book.title}`,
      description,
    },
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { slug, sectionSlug } = await params;
  const result = getBookSection(slug, sectionSlug);

  if (!result) {
    notFound();
  }

  const { book, section, sections } = result;
  const sectionIndex = sections.findIndex((item) => item.slug === section.slug);
  const previousSection = sectionIndex > 0 ? sections[sectionIndex - 1] : null;
  const nextSection = sectionIndex < sections.length - 1 ? sections[sectionIndex + 1] : null;
  const sectionPath = `/books/${book.slug}/sections/${section.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: section.title,
      isPartOf: {
        "@type": "Book",
        name: book.title,
        url: absoluteUrl(`/books/${book.slug}`),
      },
      author: {
        "@type": "Person",
        name: book.author,
      },
      inLanguage: book.language,
      isAccessibleForFree: true,
      position: sectionIndex + 1,
      url: absoluteUrl(sectionPath),
      mainEntityOfPage: absoluteUrl(sectionPath),
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
        {
          "@type": "ListItem",
          position: 4,
          name: section.title,
          item: absoluteUrl(sectionPath),
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="mx-auto w-full max-w-7xl">
        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-emerald-900">
          <Link href="/">Home</Link>
          <span className="text-stone-400">/</span>
          <Link href="/books">Books</Link>
          <span className="text-stone-400">/</span>
          <Link href={`/books/${book.slug}`}><TextWithSalawat text={book.title} /></Link>
        </nav>

        <div className="grid gap-8 py-12 lg:grid-cols-[18rem_1fr] lg:items-start">
          <BookSidebar book={book} sections={sections} activeSectionSlug={section.slug} />

          <div>
            <header className="pb-10">
              <h1 className="mt-4 font-serif text-5xl font-semibold leading-none tracking-tight text-emerald-950 sm:text-6xl">
                <TextWithSalawat text={section.title} />
              </h1>
              <p className="mt-5 text-lg leading-8 text-stone-700">
                From <Link className="font-semibold text-emerald-900" href={`/books/${book.slug}`}><TextWithSalawat text={book.title} /></Link> by {book.author}.
              </p>
            </header>

            <div className="grid gap-7 rounded-[1.75rem] border border-emerald-950/10 bg-white/90 p-5 shadow-sm shadow-emerald-950/5 sm:p-8">
              {section.pages.map((page) => (
                <section id={`page-${page.pageNumber}`} key={page.pageNumber}>
                  <div className="grid gap-4 text-lg leading-9 text-stone-800" dir="auto">
                    {page.paragraphs.length > 0 ? (
                      page.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={`${page.pageNumber}-${paragraphIndex}`}>
                          <TextWithSalawat text={paragraph} />
                        </p>
                      ))
                    ) : (
                      <p className="text-stone-500">No extractable text found on this page.</p>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <nav className="grid gap-4 py-12 sm:grid-cols-2">
              {previousSection ? (
                <Link
                  className="rounded-2xl border border-emerald-950/10 bg-white/75 p-5 text-stone-700 transition hover:bg-white"
                  href={`/books/${book.slug}/sections/${previousSection.slug}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Previous
                  </span>
                  <span className="mt-2 block font-serif text-2xl font-semibold text-emerald-950">
                    <TextWithSalawat text={previousSection.title} />
                  </span>
                </Link>
              ) : <span />}
              {nextSection ? (
                <Link
                  className="rounded-2xl border border-emerald-950/10 bg-white/75 p-5 text-right text-stone-700 transition hover:bg-white"
                  href={`/books/${book.slug}/sections/${nextSection.slug}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Next
                  </span>
                  <span className="mt-2 block font-serif text-2xl font-semibold text-emerald-950">
                    <TextWithSalawat text={nextSection.title} />
                  </span>
                </Link>
              ) : null}
            </nav>
          </div>
        </div>
      </article>
    </main>
  );
}
