/**
 * Local content source for Poetry — same disclosed pattern as
 * content/writing.ts: shape matches what the eventual CMS will manage,
 * nothing here is a fabricated poem. Every piece is `status: "draft"`
 * with empty `lines`/`audioSrc` until a real one exists.
 */

export type PoetryMood =
  | "melancholic"
  | "hopeful"
  | "romantic"
  | "reflective"
  | "restless";

export type ContentStatus = "draft" | "published";

export interface MoodStyle {
  accent: string;
  background: string;
  /** Relative pacing for this mood's motion — slower moods get longer
   *  GSAP durations wherever the gallery/detail page reads this. */
  motionScale: number;
}

export const MOOD_STYLES: Record<PoetryMood, MoodStyle> = {
  melancholic: { accent: "#5a6470", background: "#08090b", motionScale: 1.4 },
  hopeful: { accent: "#c9a24b", background: "#0f1113", motionScale: 0.9 },
  romantic: { accent: "#b8765f", background: "#0f0b0a", motionScale: 1.1 },
  reflective: { accent: "#8fa896", background: "#08090b", motionScale: 1.3 },
  restless: { accent: "#a7a49c", background: "#0f1113", motionScale: 0.7 },
};

export interface PoemPiece {
  slug: string;
  title: string;
  excerpt: string;
  mood: PoetryMood;
  status: ContentStatus;
  publishedAt: string | null;
  featured: boolean;
  displayOrder: number;
  /** The poem itself, one entry per line. Empty until published. */
  lines: string[];
  /** Path to a voice-recording audio file, or null if not recorded yet. */
  audioSrc: string | null;
  /** Real cover image URL, or null — falls back to the mood gradient. */
  coverImage: string | null;
  /** Ambient full-bleed background for the poem's reading page, or null. */
  backgroundImage: string | null;
}

export const POEMS: PoemPiece[] = [
  {
    slug: "home",
    title: "Home",
    excerpt: "On the place that keeps being one, no matter who leaves it.",
    mood: "hopeful",
    status: "draft",
    publishedAt: null,
    featured: true,
    displayOrder: 0,
    lines: [],
    audioSrc: null,
    coverImage: null,
    backgroundImage: null,
  },
  {
    slug: "her",
    title: "Her",
    excerpt: "A short one. Still too short to say everything.",
    mood: "romantic",
    status: "draft",
    publishedAt: null,
    featured: false,
    displayOrder: 1,
    lines: [],
    audioSrc: null,
    coverImage: null,
    backgroundImage: null,
  },
  {
    slug: "after",
    title: "After",
    excerpt: "What's left standing once the noise clears.",
    mood: "melancholic",
    status: "draft",
    publishedAt: null,
    featured: false,
    displayOrder: 2,
    lines: [],
    audioSrc: null,
    coverImage: null,
    backgroundImage: null,
  },
  {
    slug: "untitled-almost-quit",
    title: "Untitled (for the version of me that almost quit)",
    excerpt: "A poem, not yet ready to leave the room it was written in.",
    mood: "reflective",
    status: "draft",
    publishedAt: null,
    featured: false,
    displayOrder: 3,
    lines: [],
    audioSrc: null,
    coverImage: null,
    backgroundImage: null,
  },
  {
    slug: "pulpit-and-pull-requests",
    title: "What the Pulpit Taught Me About Pull Requests",
    excerpt: "Two disciplines that turned out to want the same patience.",
    mood: "restless",
    status: "draft",
    publishedAt: null,
    featured: false,
    displayOrder: 4,
    lines: [],
    audioSrc: null,
    coverImage: null,
    backgroundImage: null,
  },
];

export function getPoem(slug: string): PoemPiece | undefined {
  return POEMS.find((p) => p.slug === slug);
}

export function getAdjacentPoems(slug: string) {
  const sorted = [...POEMS].sort((a, b) => a.displayOrder - b.displayOrder);
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: sorted[(index - 1 + sorted.length) % sorted.length],
    next: sorted[(index + 1) % sorted.length],
  };
}
