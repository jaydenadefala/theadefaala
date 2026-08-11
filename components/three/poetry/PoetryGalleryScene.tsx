"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";
import type * as THREE from "three";
import ParticleField from "@/components/three/ParticleField";
import PoemCard from "./PoemCard";
import { POEMS, MOOD_STYLES } from "@/content/poetry";
import navStyles from "./PoetryNav.module.css";

const SPACING = 3.4;

function CameraDrift() {
  useFrame(({ clock, camera }) => {
    // Poetry's camera barely moves — a held shot, not a pan.
    camera.position.y = 0.15 + Math.sin(clock.elapsedTime * 0.08) * 0.03;
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}

export default function PoetryGalleryScene() {
  const sorted = useMemo(
    () => [...POEMS].sort((a, b) => a.displayOrder - b.displayOrder),
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const rowRef = useRef<THREE.Group>(null);

  const goTo = (i: number) => {
    setCurrentIndex(((i % sorted.length) + sorted.length) % sorted.length);
  };

  useLayoutEffect(() => {
    if (!rowRef.current) return;
    gsap.to(rowRef.current.position, {
      x: -currentIndex * SPACING,
      duration: 1.1,
      ease: "power3.inOut",
    });
  }, [currentIndex]);

  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(currentIndex - 1);
      if (e.key === "ArrowRight") goTo(currentIndex + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <>
      <CameraDrift />
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={0.6} />
      <ParticleField
        count={100}
        spread={{ x: 10, y: 4 }}
        depthRange={[-3, -6]}
        opacity={0.2}
      />

      <group ref={rowRef}>
        {sorted.map((piece, i) => (
          <PoemCard
            key={piece.slug}
            piece={piece}
            mood={MOOD_STYLES[piece.mood]}
            slotX={i * SPACING}
            isActive={i === currentIndex}
          />
        ))}
      </group>

      <Html fullscreen style={{ pointerEvents: "none" }} wrapperClass="poetry-nav-overlay">
        <div className={navStyles.overlay}>
          <button
            type="button"
            className={navStyles.arrow}
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous poem"
          >
            ←
          </button>
          <button
            type="button"
            className={navStyles.arrow}
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next poem"
          >
            →
          </button>
        </div>
        <div className={navStyles.indicator}>
          {String(currentIndex + 1).padStart(2, "0")} / {String(sorted.length).padStart(2, "0")}
        </div>
      </Html>
    </>
  );
}
