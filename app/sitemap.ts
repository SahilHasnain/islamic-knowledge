import type { MetadataRoute } from "next";

import { getBooks } from "@/lib/books";
import { absoluteUrl } from "@/lib/seo";
import { getAuthorSlug } from "@/lib/taxonomy";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const books = getBooks();
  const authors = Array.from(new Set(books.map((book) => book.author)));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/books"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...books.map((book) => ({
      url: absoluteUrl(`/books/${book.slug}`),
      lastModified: new Date(book.extractedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...books.flatMap((book) =>
      (book.sections ?? []).map((section) => ({
        url: absoluteUrl(`/books/${book.slug}/sections/${section.slug}`),
        lastModified: new Date(book.extractedAt),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
    ),
    {
      url: absoluteUrl("/authors"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...authors.map((author) => ({
      url: absoluteUrl(`/authors/${getAuthorSlug(author)}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
