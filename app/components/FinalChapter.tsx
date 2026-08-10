"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import styles from "./FinalChapter.module.css";

export default function FinalChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useScrollReveal(
    sectionRef,
    [kickerRef, headlineRef, actionsRef, footerRef],
    { duration: 0.8 }
  );

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
