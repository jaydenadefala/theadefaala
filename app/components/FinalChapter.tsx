"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import styles from "./FinalChapter.module.css";

interface FinalChapterProps {
  email: string;
  identityRoles: string[];
  ctaHeadline: string;
  ctaButtonText: string;
  ctaSecondaryText: string;
  copyrightName: string;
}

export default function FinalChapter({
  email,
  identityRoles,
  ctaHeadline,
  ctaButtonText,
  ctaSecondaryText,
  copyrightName,
}: FinalChapterProps) {
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
        {ctaHeadline}
      </h2>

      <div ref={actionsRef} className={styles.actions}>
        <Link href="/connect" className={styles.primary}>
          {ctaButtonText}
        </Link>
        <a href={`mailto:${email}`} className={styles.secondary}>
          {ctaSecondaryText}
        </a>
      </div>

      <div ref={footerRef} className={styles.footer}>
        <span className={styles.identities}>{identityRoles.join(" · ")}</span>
        <span className={styles.copyright}>
          © {new Date().getFullYear()} {copyrightName}
        </span>
      </div>
    </section>
  );
}
