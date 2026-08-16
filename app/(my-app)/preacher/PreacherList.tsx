"use client";

import { useRef } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import type { PreacherMessage } from "@/content/preacher";
import styles from "./preacher.module.css";

interface PreacherListProps {
  messages: PreacherMessage[];
}

/**
 * Deliberately the plainest list on the site — opacity-only reveal, no
 * y-translate, no hover tilt, no cards. Same restraint as the homepage
 * PreacherChapter: the contrast with Writing/Poetry/Development's
 * spatial treatment is the point, not an oversight.
 */
export default function PreacherList({ messages }: PreacherListProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<HTMLAnchorElement[]>([]);

  itemRefs.current = [];

  useScrollReveal(sectionRef, itemRefs, {
    y: 0,
    stagger: 0.15,
    duration: 0.9,
    ease: "power1.out",
  });

  return (
    <section
      ref={sectionRef}
      className={styles.list}
      aria-label="Messages and reflections"
    >
      {messages.map((message) => (
        <Link
          key={message.slug}
          href={`/preacher/${message.slug}`}
          className={styles.entry}
          ref={(el) => {
            if (el) itemRefs.current.push(el);
          }}
        >
          {message.coverImage && (
            <span className={styles.entryThumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={message.coverImage} alt="" />
            </span>
          )}
          <span className={styles.entryBody}>
            <span className={styles.entryStatus}>
              {message.category}
              {message.status === "draft" ? " · Coming soon" : ""}
            </span>
            <h2 className={styles.entryTitle}>{message.title}</h2>
          </span>
        </Link>
      ))}
    </section>
  );
}
