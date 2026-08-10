"use client";

import type { RefObject } from "react";
import styles from "./IdentityOverlay.module.css";

export const NAME = "theAdefala";
export const ROLES = ["Developer", "Writer", "Poet", "Preacher"];

interface IdentityOverlayProps {
  letterRefs: RefObject<HTMLSpanElement[]>;
  labelRefs: RefObject<HTMLLIElement[]>;
  cursorRef: RefObject<HTMLSpanElement | null>;
}

/**
 * The typed name + identity labels — the one piece of the opening scene
 * that must stay real, crisp DOM (accessibility, SEO, legibility), used
 * identically by both the WebGL path and the DOM/CSS fallback so they
 * can never visually drift apart.
 */
export function IdentityOverlay({
  letterRefs,
  labelRefs,
  cursorRef,
}: IdentityOverlayProps) {
  // Reset each render — callback refs below repopulate in DOM order.
  letterRefs.current = [];
  labelRefs.current = [];

  return (
    <div className={styles.identity}>
      <h1 className={styles.name}>
        <span aria-hidden="true">
          {NAME.split("").map((char, i) => (
            <span
              key={i}
              className={styles.letter}
              ref={(el) => {
                if (el) letterRefs.current.push(el);
              }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
          <span ref={cursorRef} className={styles.cursor}>
            &nbsp;
          </span>
        </span>
        <span
          className="sr-only"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          {NAME}
        </span>
      </h1>

      <ul className={styles.labels}>
        {ROLES.map((role) => (
          <li
            key={role}
            className={styles.label}
            ref={(el) => {
              if (el) labelRefs.current.push(el);
            }}
          >
            <span>{role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScrollCue({
  scrollCueRef,
}: {
  scrollCueRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={scrollCueRef} className={styles.scrollCue}>
      Scroll
      <span className={styles.scrollLine} aria-hidden="true" />
    </div>
  );
}
