"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import { getReducedMotionNow } from "@/lib/motion/useReducedMotion";
import styles from "./WritingChapter.module.css";

export default function WritingChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const teaserRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useScrollReveal(
    sectionRef,
    [kickerRef, headlineRef, teaserRef, actionsRef],
    { duration: 0.8 }
  );

  const handleContinue = () => {
    const next = document.getElementById("development");
    next?.scrollIntoView({
      behavior: getReducedMotionNow() ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="writing"
      className={styles.section}
      aria-label="Writing"
    >
      <div className={styles.inner}>
        <div ref={kickerRef} className={styles.kicker}>
          <span className={styles.kickerLine} aria-hidden="true" />
          Chapter One — Writing
        </div>

        <h2 ref={headlineRef} className={styles.headline}>
          Some things are only true in sentences.
        </h2>

        <p ref={teaserRef} className={styles.teaser}>
          Essays, reflections, and poems written between builds and
          Sundays — the throughline underneath everything else here. A
          working archive, not a highlight reel.
        </p>

        <div ref={actionsRef} className={styles.actions}>
          <Link href="/writing" className={styles.primary}>
            Yes, show me the real thing
          </Link>
          <button
            type="button"
            className={styles.secondary}
            onClick={handleContinue}
          >
            Continue scrolling
          </button>
        </div>
      </div>
    </section>
  );
}
