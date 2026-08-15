import { getPayloadClient } from "./getPayloadClient";
import { serializeRichTextToParagraphs } from "./serializeRichText";
import type { WritingPiece } from "@/content/writing";
import type { Writing as WritingDoc } from "@/payload-types";

/**
 * Proof-of-concept adapter for one collection, per Milestone 10's
 * scope — the same pattern extends to poems/development-projects/
 * preacher-messages in Milestone 11 ("connect every public experience
 * to CMS data"), not built out here to keep this milestone's diff to
 * "foundation," not "full rewire."
 *
 * The exported function names/shapes deliberately mirror
 * content/writing.ts's getWritingPiece/getAdjacentWritingPieces, so
 * swapping the import source later is close to a drop-in change for
 * whatever calls them — the only difference call sites need to handle
 * is that these are async (real data fetching) where the static array
 * lookups were synchronous.
 */
function toDomain(doc: WritingDoc): WritingPiece {
  return {
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle ?? undefined,
    excerpt: doc.excerpt,
    category: doc.category,
    accent: doc.accent,
    status: doc._status === "published" ? "published" : "draft",
    // Payload's native draft system doesn't track a first-published
    // timestamp out of the box; approximating with updatedAt for
    // published docs is good enough here and can be swapped for a
    // real publishedAt field later without touching any component.
    publishedAt: doc._status === "published" ? doc.updatedAt : null,
    featured: doc.featured ?? false,
    displayOrder: doc.displayOrder ?? 0,
    body: serializeRichTextToParagraphs(doc.body),
  };
}

export async function getWritingPieces(): Promise<WritingPiece[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "writing",
    sort: "displayOrder",
    limit: 100,
  });
  return result.docs.map(toDomain);
}

export async function getWritingPiece(
  slug: string
): Promise<WritingPiece | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "writing",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const doc = result.docs[0];
  return doc ? toDomain(doc) : undefined;
}

export async function getAdjacentWritingPieces(slug: string) {
  const pieces = await getWritingPieces();
  const index = pieces.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: pieces[(index - 1 + pieces.length) % pieces.length],
    next: pieces[(index + 1) % pieces.length],
  };
}
