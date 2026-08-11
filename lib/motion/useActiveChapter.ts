"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks which chapter section is currently most centered in the
 * viewport, via IntersectionObserver rather than hand-rolled scroll
 * math. Powers the chapter rail and anything else that needs "where in
 * the story is the reader right now."
 */
export function useActiveChapter(chapterIds: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const ratiosRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const elements = chapterIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratiosRef.current[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        }

        let bestId: string | null = null;
        let bestRatio = 0;
        for (const id of chapterIds) {
          const ratio = ratiosRef.current[id] ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActive(bestId);
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-15% 0px -15% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterIds.join(",")]);

  return active;
}
