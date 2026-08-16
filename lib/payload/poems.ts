import { getPayloadClient } from "./getPayloadClient";
import { pickFeatured } from "./featured";
import { resolveMediaUrl } from "./media";
import type { PoemPiece } from "@/content/poetry";
import type { Poem as PoemDoc } from "@/payload-types";

function toDomain(doc: PoemDoc): PoemPiece {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    mood: doc.mood,
    status: doc._status === "published" ? "published" : "draft",
    publishedAt: doc._status === "published" ? doc.updatedAt : null,
    featured: doc.featured ?? false,
    displayOrder: doc.displayOrder ?? 0,
    lines: (doc.lines ?? []).map((l) => l.text),
    audioSrc: resolveMediaUrl(doc.audio),
    coverImage: resolveMediaUrl(doc.coverImage),
    backgroundImage: resolveMediaUrl(doc.backgroundImage),
  };
}

export async function getPoems(): Promise<PoemPiece[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "poems",
    sort: "displayOrder",
    depth: 1,
    limit: 100,
  });
  return result.docs.map(toDomain);
}

export async function getPoem(slug: string): Promise<PoemPiece | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "poems",
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  });
  const doc = result.docs[0];
  return doc ? toDomain(doc) : undefined;
}

/** Homepage teaser lookup — the poem marked featured, or the first one. */
export async function getFeaturedPoem(): Promise<PoemPiece | undefined> {
  const poems = await getPoems();
  return pickFeatured(poems);
}

export async function getAdjacentPoems(slug: string) {
  const poems = await getPoems();
  const index = poems.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: poems[(index - 1 + poems.length) % poems.length],
    next: poems[(index + 1) % poems.length],
  };
}
