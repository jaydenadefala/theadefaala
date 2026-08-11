"use client";

import { useActiveChapter } from "@/lib/motion/useActiveChapter";
import styles from "./ChapterRail.module.css";

const CHAPTERS = [
  { id: "top", label: "Intro" },
  { id: "writing", label: "Writing" },
  { id: "development", label: "Development" },
  { id: "poetry", label: "Poetry" },
  { id: "preacher", label: "Preacher" },
  { id: "connect", label: "Connect" },
];

const CHAPTER_IDS = CHAPTERS.map((c) => c.id);

/**
 * Quiet desktop-only orientation cue — a sense of place across the
 * scroll, not a hard requirement to understand the page (hidden below
 * 1024px, and it's purely a navigation aid: nothing on the page depends
 * on it being visible).
 */
export default function ChapterRail() {
  const active = useActiveChapter(CHAPTER_IDS);

  return (
    <nav className={styles.rail} aria-label="Chapter navigation">
      <ul>
        {CHAPTERS.map((chapter) => {
          const isActive = active === chapter.id;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className={isActive ? styles.active : undefined}
                aria-current={isActive ? "true" : undefined}
              >
                <span className={styles.label}>{chapter.label}</span>
                <span className={styles.dot} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
