import { slugify } from "@/lib/slugs";

export function getAuthorSlug(author: string) {
  return slugify(author);
}
