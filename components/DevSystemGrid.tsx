"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import DevSystemCard from "./DevSystemCard";
import type { DevelopmentProject } from "@/content/development";
import styles from "./DevSystemGrid.module.css";

interface DevSystemGridProps {
  label: string;
  projects: DevelopmentProject[];
}

export default function DevSystemGrid({ label, projects }: DevSystemGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  itemRefs.current = [];

  useScrollReveal(sectionRef, [labelRef], { duration: 0.7 });
  useScrollReveal(sectionRef, itemRefs, {
    start: "top 75%",
    stagger: 0.12,
    duration: 0.7,
    y: 20,
  });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={labelRef} className={styles.label}>
        <span className={styles.labelLine} aria-hidden="true" />
        {label}
      </div>
      <div className={styles.grid}>
        {projects.map((project) => (
          <div
            key={project.slug}
            className={styles.gridItem}
            ref={(el) => {
              if (el) itemRefs.current.push(el);
            }}
          >
            <DevSystemCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
