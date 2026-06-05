import Link from "next/link";

import { TextWithSalawat } from "@/components/text-with-salawat";
import type { Book, BookSection } from "@/lib/books";

type BookSidebarProps = {
  book: Book;
  sections: BookSection[];
  activeSectionSlug?: string;
};

export function BookSidebar({ book, sections, activeSectionSlug }: BookSidebarProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-[1.5rem] border border-emerald-950/10 bg-white/80 p-5 shadow-sm shadow-emerald-950/5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-auto">
      <Link
        className="block rounded-2xl bg-emerald-950 p-4 text-white transition hover:bg-emerald-900"
        href={`/books/${book.slug}`}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/70">
          Contents
        </span>
        <span className="mt-2 block font-serif text-2xl font-semibold leading-tight">
          <TextWithSalawat text={book.title} />
        </span>
      </Link>

      <nav className="mt-5 grid gap-2 text-sm" aria-label={`${book.title} sections`}>
        {sections.map((section, index) => {
          const isActive = section.slug === activeSectionSlug;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`rounded-xl px-3 py-2 leading-5 transition ${
                isActive
                  ? "bg-emerald-950 text-white shadow-sm shadow-emerald-950/15"
                  : "text-stone-700 hover:bg-emerald-50 hover:text-emerald-950"
              }`}
              href={`/books/${book.slug}/sections/${section.slug}`}
              key={`${section.slug}-${index}`}
            >
              <TextWithSalawat text={section.title} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
