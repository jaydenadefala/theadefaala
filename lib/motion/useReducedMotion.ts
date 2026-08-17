"use client";

import { useSyncExternalStore } from "react";
import { REDUCED_MOTION_QUERY } from "./tokens";

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** SSR has no window — match the pre-hydration DOM (motion allowed). */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Tracks prefers-reduced-motion live (not just at mount), so a user who
 * toggles the OS setting mid-session gets an honest answer without a
 * reload. Every chapter's motion branch should read from this instead of
 * a one-off `window.matchMedia(...).matches` check.
 *
 * useSyncExternalStore, not useState+useEffect: this is exactly the
 * "subscribe to an external browser API, safely across SSR" case it
 * exists for — no risk of a hydration-mismatch flash between the SSR
 * default and the first client read.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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
