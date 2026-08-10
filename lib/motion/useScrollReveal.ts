"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE } from "./tokens";
import { getReducedMotionNow } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type RevealTarget = RefObject<Element | null>;
/** A ref holding a dynamically-collected array, e.g. `cardRefs.current.push(el)`. */
type RevealTargetList = RefObject<(Element | null)[]>;

interface ScrollRevealOptions {
  /** ScrollTrigger start position. Default "top 70%". */
  start?: string;
  /** Fire once and never re-trigger on scroll-back. Default true. */
  once?: boolean;
  /** Stagger between targets, in seconds. Default 0.12. */
  stagger?: number;
  duration?: number;
  ease?: string;
  /** Vertical travel distance in px. Set 0 for an opacity-only reveal. */
  y?: number;
  /** Extra/override tween-from properties (e.g. rotateX for card tilt). */
  from?: gsap.TweenVars;
  /** Extra/override tween-to properties. */
  to?: gsap.TweenVars;
}

/**
 * The shared "fire once when scrolled into view" reveal used across the
 * homepage chapters. Covers the common case (fade + rise, optionally
 * staggered); chapters with genuinely bespoke sequencing (Poetry,
 * Preacher) build their own gsap.timeline but still pull duration/ease
 * from ./tokens so the *values* stay centralized even when the shape
 * of the animation doesn't fit this hook.
 */
export function useScrollReveal(
  triggerRef: RevealTarget,
  targets: RevealTarget[] | RevealTargetList,
  options: ScrollRevealOptions = {}
) {
  const {
    start = "top 70%",
    once = true,
    stagger = 0.12,
    duration = DURATION.slow,
    ease = EASE.standard,
    y = 24,
    from,
    to,
  } = options;

  useLayoutEffect(() => {
    const reduceMotion = getReducedMotionNow();
    const els = (
      Array.isArray(targets)
        ? targets.map((t) => t.current)
        : (targets.current ?? [])
    ).filter((el): el is Element => Boolean(el));

    if (els.length === 0) return;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(els, { autoAlpha: 1, y: 0, rotateX: 0, ...to });
        return;
      }

      gsap.fromTo(
        els,
        { autoAlpha: 0, y, ...from },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          ease,
          stagger,
          ...to,
          scrollTrigger: {
            trigger: triggerRef.current,
            start,
            once,
          },
        }
      );
    }, triggerRef);

    return () => ctx.revert();
    // Intentionally mount-only: refs are stable across the component's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
