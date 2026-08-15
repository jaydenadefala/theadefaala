"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getReducedMotionNow } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ChapterRecedeOptions {
  /** How far the chapter sinks in scale as it exits. 1 = no shrink. */
  recedeScale?: number;
  /** How far the chapter fades as it exits. 1 = no fade. */
  recedeOpacity?: number;
}

/**
 * Ties a chapter's *exit* to scroll, not just its entrance. Every
 * chapter already has its own entrance reveal (useScrollReveal); this
 * is the missing other half — as the section scrolls up past the
 * viewport, it visibly sinks and fades (scrubbed, not a fixed-duration
 * tween) rather than just sliding off unchanged. Paired with the
 * shared WorldScene background (camera drift + accent-tint crossfade
 * across the whole scroll range), this is what makes leaving a
 * chapter read as *receding into the same depth* the world is already
 * moving through, instead of an abrupt cut to the next section.
 *
 * Scoped deliberately: this is a per-chapter exit cue within normal
 * document flow, not a pinned/overlapping chapter-transition system
 * (chapters don't spatially overlap — that's a larger, separate
 * scroll-architecture change with much higher blast radius on scroll
 * anchors and mobile behavior, not attempted here).
 */
export function useChapterRecede(
  sectionRef: RefObject<HTMLElement | null>,
  options: ChapterRecedeOptions = {}
) {
  const { recedeScale = 0.94, recedeOpacity = 0.5 } = options;

  useLayoutEffect(() => {
    if (getReducedMotionNow() || !sectionRef.current) return;

    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 1, opacity: 1 },
        {
          scale: recedeScale,
          opacity: recedeOpacity,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "bottom 65%",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
