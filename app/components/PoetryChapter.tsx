"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE } from "@/lib/motion/tokens";
import { getReducedMotionNow } from "@/lib/motion/useReducedMotion";
import type { PoemPiece } from "@/content/poetry";
import styles from "./PoetryChapter.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Used whenever there's no published featured poem with real lines yet
 * (true for all seeded poems today — they're honest drafts with empty
 * `lines`). The moment a featured poem is published with content, its
 * real lines take over automatically; this stays as the graceful
 * "nothing to show yet" state, not a permanent placeholder.
 */
const FALLBACK_LINES = [
  "I have learned to build in seasons",
  "I did not choose,",
  "and to call that faith",
  "instead of delay.",
];

interface PoetryChapterProps {
  poem?: PoemPiece;
}

export default function PoetryChapter({ poem }: PoetryChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const poemRef = useRef<HTMLParagraphElement>(null);
  const teaserRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const lines = useMemo(
    () =>
      poem && poem.status === "published" && poem.lines.length > 0
        ? poem.lines
        : FALLBACK_LINES,
    [poem]
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (getReducedMotionNow()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          once: true,
        },
        defaults: { ease: EASE.soft },
      });

      tl.fromTo(
        kickerRef.current,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 1 }
      )
        .fromTo(
          poemRef.current?.querySelectorAll(`.${styles.line}`) ?? [],
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.35 },
          "-=0.4"
        )
        .fromTo(
          teaserRef.current,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 1 },
          "-=0.2"
        )
        .fromTo(
          linkRef.current,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          "-=0.5"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="poetry"
      className={styles.section}
      aria-label="Poetry"
    >
      <div className={styles.inner}>
        <div ref={kickerRef} className={styles.kicker}>
          <span className={styles.kickerLine} aria-hidden="true" />
          Chapter Three — Poetry
          <span className={styles.kickerLine} aria-hidden="true" />
        </div>

        <p ref={poemRef} className={styles.poem}>
          {lines.map((line, i) => (
            <span key={`${i}-${line}`} className={styles.line}>
              {line}
            </span>
          ))}
        </p>

        <p ref={teaserRef} className={styles.teaser}>
          Poetry is where the other three chapters get honest with each
          other. A slower room, kept mostly quiet.
        </p>

        <Link
          ref={linkRef}
          href={poem ? `/poetry/${poem.slug}` : "/poetry"}
          className={styles.link}
        >
          Read the poems →
        </Link>
      </div>
    </section>
  );
}
