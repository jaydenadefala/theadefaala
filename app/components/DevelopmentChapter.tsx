"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./DevelopmentChapter.module.css";

gsap.registerPlugin(ScrollTrigger);

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

export default function DevelopmentChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);

  cardRefs.current = [];

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap.fromTo(
        [kickerRef.current, headlineRef.current],
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

      gsap.fromTo(
        cardRefs.current,
        { autoAlpha: 0, y: 40, rotateX: 6 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        footerRef.current,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 30%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
        {TRACKS.map((track) => (
          <div
            key={track.label}
            className={styles.card}
            ref={(el) => {
              if (el) cardRefs.current.push(el);
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
          What&rsquo;s built, how it&rsquo;s built, and why it matters —
          laid out in more detail.
        </p>
        <Link href="/development" className={styles.link}>
          See the work →
        </Link>
      </div>
    </section>
  );
}
