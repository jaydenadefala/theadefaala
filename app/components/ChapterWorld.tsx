"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "@/components/three/Scene";
import WorldScene from "@/components/three/world/WorldScene";
import styles from "./ChapterWorld.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * The connective tissue between chapters: one persistent, fixed WebGL
 * background (particles + a continuous scroll-linked camera drift and
 * ambient tint) sitting behind Writing through Connect, so the *space*
 * feels continuous even though each chapter keeps its own identity on
 * top of it. Pure enhancement — the fallback is nothing extra, since
 * every chapter already has a complete, correct look without it.
 */
export default function ChapterWorld({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Mutated by ScrollTrigger, read by WorldScene's useFrame — plain ref
  // on purpose, so scroll never drives a React re-render.
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    // Every chapter's own scroll-reveal ScrollTrigger gets created around
    // the same time as this one, but the WebGL canvases (this component's
    // and OpeningScene's) mount asynchronously behind a dynamic import and
    // a capability check — neither changes document height (both are
    // position:fixed / fixed-height sections), but a stale measurement
    // taken mid-mount is still the classic failure mode for ScrollTrigger
    // on pages with async content. Force a couple of recalculations after
    // things have had a chance to settle, rather than trusting the very
    // first measurement.
    const refreshTimers = [
      window.setTimeout(() => ScrollTrigger.refresh(), 300),
      window.setTimeout(() => ScrollTrigger.refresh(), 1500),
    ];

    return () => {
      trigger.kill();
      refreshTimers.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <Scene className={styles.canvasHost} fallback={null}>
        <WorldScene progressRef={progressRef} />
      </Scene>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
