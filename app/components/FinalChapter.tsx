"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FinalChapter.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function FinalChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap.fromTo(
        [kickerRef.current, headlineRef.current, actionsRef.current, footerRef.current],
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

  return (
    <section
      ref={sectionRef}
      id="connect"
      className={styles.section}
      aria-label="Connect"
    >
      <div ref={kickerRef} className={styles.kicker}>
        Chapter Five — Connect
      </div>

      <h2 ref={headlineRef} className={styles.headline}>
        If any of this resonated, let&rsquo;s talk.
      </h2>

      <div ref={actionsRef} className={styles.actions}>
        <Link href="/connect" className={styles.primary}>
          Say hello
        </Link>
        <a
          href="mailto:jaydenadefala@gmail.com"
          className={styles.secondary}
        >
          or email directly
        </a>
      </div>

      <div ref={footerRef} className={styles.footer}>
        <span className={styles.identities}>
          Developer · Writer · Poet · Preacher
        </span>
        <span className={styles.copyright}>© 2026 theAdefala</span>
      </div>
    </section>
  );
}
