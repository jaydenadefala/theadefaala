/**
 * Canonical site origin for sitemap/robots/OG absolute URLs. Reads
 * NEXT_PUBLIC_SITE_URL (set this in production); falls back to
 * localhost for local dev so nothing breaks without it configured.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
