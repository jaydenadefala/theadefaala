/**
 * Centralized motion + layout constants.
 *
 * Every chapter animation should pull its durations, eases, and
 * breakpoints from here instead of hand-writing magic numbers. This is
 * the single source of truth the design brief calls for — CSS reads the
 * parallel custom properties in globals.css, JS/GSAP reads this file.
 */

export const EASE = {
  standard: "power3.out",
  soft: "power2.out",
  /** Preacher-register restraint: the least dramatic curve in the set. */
  gentle: "power1.out",
  sharp: "power4.out",
  inOut: "power3.inOut",
  sine: "sine.inOut",
  linear: "none",
} as const;

export const DURATION = {
  /** micro-interactions: hovers, cursors */
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  /** Poetry/Preacher-register pacing */
  slower: 1.4,
  glacial: 2,
} as const;

/** Matches the breakpoints already encoded as raw px in the CSS modules. */
export const BREAKPOINT = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const DESKTOP_QUERY = `(min-width: ${BREAKPOINT.mobile}px)` as const;
