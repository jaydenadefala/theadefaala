import { getPayloadClient } from "./getPayloadClient";
import { serializeRichTextToParagraphs } from "./serializeRichText";
import { pickFeatured } from "./featured";
import { resolveMediaUrl } from "./media";
import type { PreacherMessage } from "@/content/preacher";
import type { PreacherMessage as PreacherMessageDoc } from "@/payload-types";

function toDomain(doc: PreacherMessageDoc): PreacherMessage {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    coverImage: resolveMediaUrl(doc.coverImage),
    body: serializeRichTextToParagraphs(doc.body),
    scripture: doc.scripture ?? null,
    category: doc.category,
    date: doc.date ?? null,
    audioSrc: resolveMediaUrl(doc.audio),
    videoSrc: doc.videoUrl ?? null,
    featured: doc.featured ?? false,
    displayOrder: doc.displayOrder ?? 0,
    status: doc._status === "published" ? "published" : "draft",
  };
}

export async function getMessages(): Promise<PreacherMessage[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "preacher-messages",
    sort: "displayOrder",
    depth: 1,
    limit: 100,
  });
  return result.docs.map(toDomain);
}

export async function getMessage(
  slug: string
): Promise<PreacherMessage | undefined> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "preacher-messages",
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  });
  const doc = result.docs[0];
  return doc ? toDomain(doc) : undefined;
}

/** Homepage teaser lookup — the message marked featured, or the first one. */
export async function getFeaturedMessage(): Promise<
  PreacherMessage | undefined
> {
  const messages = await getMessages();
  return pickFeatured(messages);
}

export async function getAdjacentMessages(slug: string) {
  const messages = await getMessages();
  const index = messages.findIndex((m) => m.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: messages[(index - 1 + messages.length) % messages.length],
    next: messages[(index + 1) % messages.length],
  };
}
