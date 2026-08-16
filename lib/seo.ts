import type { Metadata } from "next";
import { SITE_URL } from "./siteUrl";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path only, e.g. "/writing/some-slug" — SITE_URL is prepended. */
  path: string;
  /** Cover image URL (relative or absolute), or null/undefined for none. */
  image?: string | null;
  siteName?: string;
  type?: "website" | "article";
}

/**
 * Shared canonical/Open Graph/Twitter card builder — every content
 * detail page (and the four list pages, connect page, homepage) uses
 * this instead of hand-rolling openGraph/twitter fields nine separate
 * times. Falls back gracefully when a piece has no cover image yet
 * (no fabricated preview image).
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  siteName = "theAdefala",
  type = "website",
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const absoluteImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : undefined;
  const images = absoluteImage ? [{ url: absoluteImage }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      images,
    },
    twitter: {
      card: absoluteImage ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}
