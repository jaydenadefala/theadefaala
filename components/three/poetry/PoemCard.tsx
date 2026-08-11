"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";
import type * as THREE from "three";
import { makeCardCoverTexture } from "@/lib/three/makeCardCoverTexture";
import { makeRoundedRectMask } from "@/lib/three/makeRoundedRectMask";
import type { PoemPiece, MoodStyle } from "@/content/poetry";
import styles from "./PoemCard.module.css";

interface PoemCardProps {
  piece: PoemPiece;
  mood: MoodStyle;
  slotX: number;
  isActive: boolean;
}

const WIDTH = 2.6;
const HEIGHT = WIDTH * 0.62;

export default function PoemCard({ piece, mood, slotX, isActive }: PoemCardProps) {
  const innerRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const idleOffset = useRef(Math.random() * Math.PI * 2);
  const idleEnabledRef = useRef(true);

  const texture = makeCardCoverTexture(mood.accent);
  const mask = makeRoundedRectMask(0.06);

  // Poetry idles slower and more quietly than the Writing gallery — a
  // corridor at rest, not a field of drifting objects.
  useFrame(({ clock }) => {
    if (!innerRef.current || !idleEnabledRef.current) return;
    const t = clock.elapsedTime * 0.22 + idleOffset.current;
    innerRef.current.position.y = Math.sin(t) * 0.04;
  });

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    idleEnabledRef.current = false;
    const duration = mood.motionScale * 0.7;
    const tl = gsap.timeline({
      onComplete: () => {
        idleEnabledRef.current = true;
      },
    });

    tl.to(
      inner.scale,
      {
        x: isActive ? 1 : 0.82,
        y: isActive ? 1 : 0.82,
        z: 1,
        duration,
        ease: "power2.out",
      },
      0
    );
    if (materialRef.current) {
      tl.to(
        materialRef.current,
        { opacity: isActive ? 1 : 0.4, duration, ease: "power2.out" },
        0
      );
    }

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <group position={[slotX, 0, 0]}>
      <group ref={innerRef}>
        <mesh>
          <planeGeometry args={[WIDTH, HEIGHT]} />
          <meshBasicMaterial
            ref={materialRef}
            map={texture}
            alphaMap={mask}
            transparent
            opacity={isActive ? 1 : 0.4}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <Html center position={[0, -HEIGHT / 2 - 0.5, 0]} wrapperClass="poem-card-label">
        <a
          href={`/poetry/${piece.slug}`}
          className={`${styles.label} ${isActive ? styles.active : ""}`}
        >
          <span className={styles.title}>{piece.title}</span>
          <span className={styles.excerpt}>{piece.excerpt}</span>
        </a>
      </Html>
    </group>
  );
}
