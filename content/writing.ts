/**
 * Local content source for Writing pieces — Milestone 4 scope.
 *
 * Shape matches what the eventual CMS (Milestone 10/11) will manage, so
 * swapping this file for a database query later shouldn't require
 * touching any component that consumes it. Nothing here is fabricated
 * essay content: every piece is honestly marked `status: "draft"` until
 * a real one gets written — see AGENTS.md's stance on not inventing
 * work under the user's name.
 */

export type WritingCategory = "Essay" | "Reflection" | "Poem";
export type ContentStatus = "draft" | "published";

export interface WritingPiece {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: WritingCategory;
  /** Hex accent used for the card's cover treatment in the gallery. */
  accent: string;
  /** Real cover image URL, or null — falls back to the accent gradient. */
  coverImage: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  featured: boolean;
  displayOrder: number;
  /** Paragraphs. Empty until status is "published". */
  body: string[];
}

export const WRITING_PIECES: WritingPiece[] = [
  {
    slug: "building-in-the-dark",
    title: "On building in the dark before anyone is watching",
    excerpt:
      "The work you do when no one's checking is the only work that's really yours.",
    category: "Essay",
    accent: "#c9a24b",
    coverImage: null,
    status: "draft",
    publishedAt: null,
    featured: true,
    displayOrder: 0,
    body: [],
  },
  {
    slug: "no-longer-apologize-for",
    title: "A short list of things I no longer apologize for",
    excerpt: "A working inventory, updated as it changes.",
    category: "Reflection",
    accent: "#8fa896",
    coverImage: null,
    status: "draft",
    publishedAt: null,
    featured: false,
    displayOrder: 1,
    body: [],
  },
  {
    slug: "for-the-version-of-me",
    title: "Untitled (for the version of me that almost quit)",
    excerpt: "A poem, not yet ready to leave the room it was written in.",
    category: "Poem",
    accent: "#a7a49c",
    coverImage: null,
    status: "draft",
    publishedAt: null,
    featured: false,
    displayOrder: 2,
    body: [],
  },
  {
    slug: "the-plumbing-and-the-pulpit",
    title: "The plumbing and the pulpit",
    excerpt: "Two kinds of work that turned out to need the same hands.",
    category: "Essay",
    accent: "#c9a24b",
    coverImage: null,
    status: "draft",
    publishedAt: null,
    featured: false,
    displayOrder: 3,
    body: [],
  },
  {
    slug: "sunday-unfinished",
    title: "Sunday, unfinished",
    excerpt: "On sitting with a thing before it's ready to be said.",
    category: "Reflection",
    accent: "#8fa896",
    coverImage: null,
    status: "draft",
    publishedAt: null,
    featured: false,
    displayOrder: 4,
    body: [],
  },
];

export function getWritingPiece(slug: string): WritingPiece | undefined {
  return WRITING_PIECES.find((p) => p.slug === slug);
}

export function getAdjacentWritingPieces(slug: string) {
  const sorted = [...WRITING_PIECES].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: sorted[(index - 1 + sorted.length) % sorted.length],
    next: sorted[(index + 1) % sorted.length],
  };
}
