import type { Media } from "@/payload-types";

/**
 * Resolves a Payload upload relation to a plain URL, or null.
 * Requires the query to have used `depth: 1` (or higher) so the
 * relation comes back populated as a Media object — with depth 0 it's
 * just a numeric id, which this deliberately treats the same as "no
 * image" rather than guessing a URL shape from an id alone.
 */
export function resolveMediaUrl(
  value: number | Media | null | undefined
): string | null {
  if (!value) return null;
  if (typeof value === "object") return value.url ?? null;
  return null;
}
