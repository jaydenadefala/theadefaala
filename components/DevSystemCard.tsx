"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { getReducedMotionNow } from "@/lib/motion/useReducedMotion";
import type { DevelopmentProject } from "@/content/development";
import styles from "./DevSystemCard.module.css";

interface DevSystemCardProps {
  project: DevelopmentProject;
}

const MAX_TILT = 8; // degrees

/**
 * A "magnetic tilt" card — real CSS 3D (perspective + translateZ layers
 * + mouse-tracked rotateX/rotateY), not WebGL. Development is systems
 * and interfaces, not atmosphere, so this stays on the DOM/CSS side of
 * the medium-selection rule the brief itself lays out.
 *
 * The rotation is tweened on a plain JS object, not the DOM element
 * directly — React 19 sets individual CSS transform properties
 * (rotate/scale/translate) as inline styles on elements by default,
 * which collides with GSAP's own rotateX/rotateY shorthand parsing
 * ("rotateX not eligible for reset" in the console). Tweening a
 * detached object and applying the transform string by hand sidesteps
 * the conflict entirely.
 */
export default function DevSystemCard({ project }: DevSystemCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const rotation = useRef({ x: 0, y: 0 });
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const applyTransform = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`;
  };

  const ensureQuickSetters = () => {
    if (quickX.current) return;
    quickX.current = gsap.quickTo(rotation.current, "x", {
      duration: 0.4,
      ease: "power3.out",
      onUpdate: applyTransform,
    });
    quickY.current = gsap.quickTo(rotation.current, "y", {
      duration: 0.4,
      ease: "power3.out",
      onUpdate: applyTransform,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (getReducedMotionNow() || !cardRef.current) return;
    ensureQuickSetters();
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    quickY.current?.(px * MAX_TILT * 2);
    quickX.current?.(-py * MAX_TILT * 2);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    ensureQuickSetters();
    quickX.current?.(0);
    quickY.current?.(0);
  };

  return (
    <div className={styles.cardOuter}>
      <Link
        ref={cardRef}
        href={`/development/${project.slug}`}
        className={styles.card}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          {project.status === "published" ? "Live" : "In progress"}
        </span>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.description}>{project.shortDescription}</p>
        <ul className={styles.tags}>
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <span className={styles.role}>{project.role}</span>
      </Link>
    </div>
  );
}
