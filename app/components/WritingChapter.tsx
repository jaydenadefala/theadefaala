"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WritingChapter.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function WritingChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const teaserRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap.fromTo(
        [kickerRef.current, headlineRef.current, teaserRef.current, actionsRef.current],
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleContinue = () => {
    const next = document.getElementById("development");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    next?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
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
