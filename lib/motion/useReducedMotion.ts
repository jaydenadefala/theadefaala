"use client";

import { useEffect, useState } from "react";
import { REDUCED_MOTION_QUERY } from "./tokens";

/**
 * Tracks prefers-reduced-motion live (not just at mount), so a user who
 * toggles the OS setting mid-session gets an honest answer without a
 * reload. Every chapter's motion branch should read from this instead of
 * a one-off `window.matchMedia(...).matches` check.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Non-reactive, synchronous read for use inside useLayoutEffect bodies
 * where a hook can't be called (e.g. before the DOM paints). Prefer
 * useReducedMotion() in components; use this only where a layout effect
 * needs the value at the moment it runs.
 */
export function getReducedMotionNow(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
