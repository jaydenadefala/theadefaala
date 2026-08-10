"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./OpeningScene.module.css";

const NAME = "theAdefala";
const ROLES = ["Developer", "Writer", "Poet", "Preacher"];
const PHOTO_SRC = "/images/hero.jpg";

export default function OpeningScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const labelRefs = useRef<HTMLLIElement[]>([]);
  // Checked out-of-band (not via <img onError>): the SSR-rendered <img> starts
  // fetching before hydration attaches listeners, so a fast local 404 can
  // fire and be missed. A plain Image() probe below is race-free.
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => {
      if (!cancelled) setPhotoFailed(false);
    };
    probe.onerror = () => {
      if (!cancelled) setPhotoFailed(true);
    };
    probe.src = PHOTO_SRC;
    return () => {
      cancelled = true;
    };
  }, []);

  letterRefs.current = [];
  labelRefs.current = [];

  useLayoutEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctxCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(stageRef.current, { autoAlpha: 1 });
        gsap.set(dotRef.current, { autoAlpha: 0 });
        gsap.set(photoWrapRef.current, {
          clipPath: "circle(75% at 50% 50%)",
          autoAlpha: 1,
          x: 0,
        });
        gsap.set(letterRefs.current, { autoAlpha: 1, y: 0 });
        gsap.set(labelRefs.current, { autoAlpha: 1, y: 0 });
        gsap.set(scrollCueRef.current, { autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.set(stageRef.current, { autoAlpha: 1 })
        // dot appears
        .fromTo(
          dotRef.current,
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.4 },
          0.3
        )
        // dot pulses
        .to(
          dotRef.current,
          {
            scale: 1.5,
            duration: 0.35,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          0.7
        )
        // dot expands away
        .to(
          dotRef.current,
          { scale: 8, autoAlpha: 0, duration: 0.45, ease: "power2.in" },
          1.1
        )
        // photo emerges
        .fromTo(
          photoWrapRef.current,
          { clipPath: "circle(0% at 50% 50%)", autoAlpha: 0, scale: 1.06 },
          {
            clipPath: "circle(75% at 50% 50%)",
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          1.35
        )
        // photo settles then shifts aside (desktop only)
        .to(
          photoWrapRef.current,
          {
            x: isDesktop ? "-6%" : 0,
            duration: 0.6,
            ease: "power3.inOut",
          },
          2.5
        )
        // cursor blink-in
        .to(cursorRef.current, { autoAlpha: 1, duration: 0.1 }, 2.85)
        // name types in
        .fromTo(
          letterRefs.current,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.04, stagger: 0.055 },
          2.85
        )
        .to(cursorRef.current, { autoAlpha: 0, duration: 0.3 }, "+=0.3")
        // identity labels stack in
        .fromTo(
          labelRefs.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.15 },
          3.85
        )
        // scene settles
        .fromTo(
          scrollCueRef.current,
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          4.75
        );

      // subtle parallax tilt on pointer move, desktop + motion allowed only
      if (isDesktop) {
        const quickX = gsap.quickTo(photoWrapRef.current, "rotateY", {
          duration: 0.6,
          ease: "power3.out",
        });
        const quickY = gsap.quickTo(photoWrapRef.current, "rotateX", {
          duration: 0.6,
          ease: "power3.out",
        });
        const onMove = (e: PointerEvent) => {
          const { innerWidth, innerHeight } = window;
          const px = e.clientX / innerWidth - 0.5;
          const py = e.clientY / innerHeight - 0.5;
          quickX(px * 8);
          quickY(-py * 8);
        };
        window.addEventListener("pointermove", onMove);
        ctxCleanups.push(() =>
          window.removeEventListener("pointermove", onMove)
        );
      }
    });

    return () => {
      ctxCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.hero} aria-label="Introduction to theAdefala">
      <div ref={stageRef} className={styles.stage}>
        <div ref={dotRef} className={styles.dot} aria-hidden="true" />

        <div ref={photoWrapRef} className={styles.photoWrap}>
          {!photoFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.photo}
              src={PHOTO_SRC}
              alt="Portrait of theAdefala"
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <div className={styles.photoFallback} aria-hidden="true">
              TA
            </div>
          )}
        </div>

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
      </div>

      <div ref={scrollCueRef} className={styles.scrollCue}>
        Scroll
        <span className={styles.scrollLine} aria-hidden="true" />
      </div>
    </section>
  );
}
