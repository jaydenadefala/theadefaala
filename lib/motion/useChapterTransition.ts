"use client";

import { useRouter } from "next/navigation";

/**
 * Shared "click → View Transition → navigate" handler for spatial
 * cards across galleries. Falls back to a plain push on browsers
 * without the View Transitions API (currently: not Firefox). This is
 * the seed of a real ChapterTransition system — today it's a native
 * cross-fade; the next step (bespoke "cover fills viewport → becomes
 * page" choreography) builds on top of this hook rather than replacing
 * it, so every gallery gets the upgrade at once when that lands.
 */
export function useChapterTransition(href: string) {
  const router = useRouter();
  return (e: React.MouseEvent) => {
    e.preventDefault();
    const nav = () => router.push(href);
    if ("startViewTransition" in document) {
      (document as { startViewTransition: (cb: () => void) => void }).startViewTransition(nav);
    } else {
      nav();
    }
  };
}
