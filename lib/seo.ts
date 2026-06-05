import type { Metadata } from "next";

const fallbackSiteUrl = "http://localhost:3000";

export const siteConfig = {
  name: "Islamic Knowledge",
  description:
    "A growing library of extracted and formatted Islamic books for structured online reading.",
  url: normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ),
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function createOpenGraph({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata["openGraph"] {
  return {
    title,
    description,
    url: absoluteUrl(path),
    siteName: siteConfig.name,
    type,
  };
}

export function createMetaDescription(text: string, maxLength = 158) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

function normalizeSiteUrl(url: string | undefined) {
  if (!url) {
    return fallbackSiteUrl;
  }

  const withProtocol = /^https?:\/\//.test(url) ? url : `https://${url}`;
  return withProtocol.endsWith("/") ? withProtocol : `${withProtocol}/`;
}
