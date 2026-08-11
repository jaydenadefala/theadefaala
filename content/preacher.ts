/**
 * Local content source for Preacher messages — same disclosed pattern
 * as the other content/*.ts files. Field list matches the brief's CMS
 * shape (scripture reference, audio/video, category). No fabricated
 * sermons: every entry is honestly status:"draft" with empty body
 * until a real one exists.
 */

export type ContentStatus = "draft" | "published";

export interface PreacherMessage {
  slug: string;
  title: string;
  excerpt: string;
  /** Paragraphs. Empty until published. */
  body: string[];
  scripture: string | null;
  category: string;
  date: string | null;
  audioSrc: string | null;
  videoSrc: string | null;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export const PREACHER_MESSAGES: PreacherMessage[] = [
  {
    slug: "the-first-message",
    title: "The first message",
    excerpt: "Where this chapter actually starts.",
    body: [],
    scripture: null,
    category: "Message",
    date: null,
    audioSrc: null,
    videoSrc: null,
    featured: true,
    displayOrder: 0,
    status: "draft",
  },
  {
    slug: "sunday-i-almost-skipped",
    title: "Notes from a Sunday I almost skipped",
    excerpt: "On showing up anyway.",
    body: [],
    scripture: null,
    category: "Reflection",
    date: null,
    audioSrc: null,
    videoSrc: null,
    featured: false,
    displayOrder: 1,
    status: "draft",
  },
  {
    slug: "building-and-believing",
    title: "On building and believing at the same time",
    excerpt: "Two things that turned out not to compete.",
    body: [],
    scripture: null,
    category: "Reflection",
    date: null,
    audioSrc: null,
    videoSrc: null,
    featured: false,
    displayOrder: 2,
    status: "draft",
  },
];

export function getMessage(slug: string): PreacherMessage | undefined {
  return PREACHER_MESSAGES.find((m) => m.slug === slug);
}

export function getAdjacentMessages(slug: string) {
  const sorted = [...PREACHER_MESSAGES].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const index = sorted.findIndex((m) => m.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: sorted[(index - 1 + sorted.length) % sorted.length],
    next: sorted[(index + 1) % sorted.length],
  };
}
