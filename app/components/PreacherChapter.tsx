"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PreacherChapter.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function PreacherChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          once: true,
        },
        defaults: { ease: "power1.out", duration: 1.1 },
      })
        .to(kickerRef.current, { autoAlpha: 1 })
        .to(ruleRef.current, { autoAlpha: 1 }, "-=0.6")
        .to(statementRef.current, { autoAlpha: 1 }, "-=0.3")
        .to(bodyRef.current, { autoAlpha: 1 }, "-=0.4")
        .to(linkRef.current, { autoAlpha: 1 }, "-=0.5");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="preacher"
      className={styles.section}
      aria-label="Preacher"
    >
      <div className={styles.inner}>
        <span ref={kickerRef} className={styles.kicker}>
          Chapter Four — Preacher
        </span>
        <div ref={ruleRef} className={styles.rule} aria-hidden="true" />
        <p ref={statementRef} className={styles.statement}>
          Everything else here is downstream of what I believe.
        </p>
        <p ref={bodyRef} className={styles.body}>
          Not a brand pillar — a starting point. The work, the words, and
          the way I build all answer to something first.
        </p>
        <Link href="/preacher" ref={linkRef} className={styles.link}>
          Read the message →
        </Link>
      </div>
    </section>
  );
}
