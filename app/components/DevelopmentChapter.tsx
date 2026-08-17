"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import { useChapterRecede } from "@/lib/motion/useChapterRecede";
import type { DevelopmentProject } from "@/content/development";
import styles from "./DevelopmentChapter.module.css";

const TRACKS = [
  {
    label: "Web",
    title: "Products, shipped.",
    body: "Interfaces and systems built end to end — from architecture to the last 5% of motion polish most teams skip.",
    tags: ["Next.js", "TypeScript", "Design systems", "Performance"],
  },
  {
    label: "Business",
    title: "The plumbing underneath.",
    body: "Ops tooling, automation, and decision-support systems — the unglamorous work that makes everything else possible.",
    tags: ["Automation", "Systems design", "Process", "Tooling"],
  },
];

interface DevelopmentChapterProps {
  project?: DevelopmentProject;
}

export default function DevelopmentChapter({ project }: DevelopmentChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);

  useChapterRecede(sectionRef);

  useScrollReveal(sectionRef, [kickerRef, headlineRef], { duration: 0.8 });

  useScrollReveal(sectionRef, cardRefs, {
    start: "top 55%",
    stagger: 0.15,
    duration: 0.9,
    y: 40,
    from: { rotateX: 6 },
    to: { rotateX: 0 },
  });

  useScrollReveal(sectionRef, [footerRef], {
    start: "top 30%",
    duration: 0.7,
    y: 16,
  });

  return (
    <section
      ref={sectionRef}
      id="development"
      className={styles.section}
      aria-label="Development"
    >
      <div className={styles.header}>
        <div ref={kickerRef} className={styles.kicker}>
          <span className={styles.kickerLine} aria-hidden="true" />
          Chapter Two — Development
        </div>
        <h2 ref={headlineRef} className={styles.headline}>
          I build the parts you don&rsquo;t see, too.
        </h2>
      </div>

      <div className={styles.grid}>
        {TRACKS.map((track, i) => (
          <div
            key={track.label}
            className={styles.card}
            ref={(el) => {
              cardRefs.current[i] = el;
              return () => {
                cardRefs.current[i] = null;
              };
            }}
          >
            <span className={styles.cardLabel}>{track.label}</span>
            <h3 className={styles.cardTitle}>{track.title}</h3>
            <p className={styles.cardBody}>{track.body}</p>
            <ul className={styles.cardTags}>
              {track.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div ref={footerRef} className={styles.footerRow}>
        <p className={styles.footerNote}>
          {project ? (
            <>
              <span className={styles.featuredLabel}>Currently</span>
              <Link
                href={`/development/${project.slug}`}
                className={styles.featuredName}
              >
                {project.name}
              </Link>
              {" — "}
              {project.shortDescription}
            </>
          ) : (
            "What's built, how it's built, and why it matters — laid out in more detail."
          )}
        </p>
        <Link href="/development" className={styles.link}>
          See the work →
        </Link>
      </div>
    </section>
  );
}
