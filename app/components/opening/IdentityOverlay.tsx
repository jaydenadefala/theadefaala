"use client";

import type { RefObject } from "react";
import styles from "./IdentityOverlay.module.css";

/** Used only when a caller doesn't have real settings data yet (should
 *  be rare — the homepage always fetches HomepageSettings). Mirrors
 *  the exact defaultValue already declared on the Payload field, not
 *  a separately-invented fallback. */
export const DEFAULT_NAME = "theAdefala";
export const DEFAULT_ROLES = ["Developer", "Writer", "Poet", "Preacher"];

interface IdentityOverlayProps {
  name: string;
  roles: string[];
  letterRefs: RefObject<(HTMLSpanElement | null)[]>;
  labelRefs: RefObject<(HTMLLIElement | null)[]>;
  cursorRef: RefObject<HTMLSpanElement | null>;
}

/**
 * The typed name + identity labels — the one piece of the opening scene
 * that must stay real, crisp DOM (accessibility, SEO, legibility), used
 * identically by both the WebGL path and the DOM/CSS fallback so they
 * can never visually drift apart. `roles` is CMS-driven (HomepageSettings
 * global, Admin milestone) — `name` currently isn't editable per-field
 * but is still threaded as a prop so it isn't hardcoded twice.
 */
export function IdentityOverlay({
  name,
  roles,
  letterRefs,
  labelRefs,
  cursorRef,
}: IdentityOverlayProps) {
  return (
    <div className={styles.identity}>
      <h1 className={styles.name}>
        <span aria-hidden="true">
          {name.split("").map((char, i) => (
            <span
              key={i}
              className={styles.letter}
              ref={(el) => {
                letterRefs.current[i] = el;
                return () => {
                  letterRefs.current[i] = null;
                };
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
          {name}
        </span>
      </h1>

      <ul className={styles.labels}>
        {roles.map((role, i) => (
          <li
            key={role}
            className={styles.label}
            ref={(el) => {
              labelRefs.current[i] = el;
              return () => {
                labelRefs.current[i] = null;
              };
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
