"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import type * as THREE from "three";
import { makeCardCoverTexture } from "@/lib/three/makeCardCoverTexture";
import { makeRoundedRectMask } from "@/lib/three/makeRoundedRectMask";
import type { WritingPiece } from "@/content/writing";
import styles from "./WritingCard.module.css";

interface WritingCardProps {
  piece: WritingPiece;
  basePosition: readonly [number, number, number];
  baseRotationY: number;
  isSelf: boolean;
  isDimmed: boolean;
  onHover: (slug: string | null) => void;
}

const WIDTH = 1.5;
const HEIGHT = WIDTH / (3 / 4);

export default function WritingCard({
  piece,
  basePosition,
  baseRotationY,
  isSelf,
  isDimmed,
  onHover,
}: WritingCardProps) {
  const router = useRouter();
  // Stable anchor — NEVER tweened, so the Html label (a child of this,
  // not of the animated inner group) stays put and reachable even while
  // the card visually flies toward the camera on hover.
  const anchorRef = useRef<THREE.Group>(null);
  // Animated inner group — hover/focus and idle drift both express as
  // *local offsets* from (0,0,0) here, relative to the stable anchor.
  const innerRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const idleOffset = useRef(Math.random() * Math.PI * 2);
  const idleEnabledRef = useRef(true);

  const texture = makeCardCoverTexture(piece.accent);
  const mask = makeRoundedRectMask(0.1);

  useFrame(({ clock }) => {
    if (!innerRef.current || !idleEnabledRef.current) return;
    const t = clock.elapsedTime * 0.4 + idleOffset.current;
    innerRef.current.position.y = Math.sin(t) * 0.08;
    innerRef.current.rotation.y = Math.sin(t * 0.6) * 0.04;
  });

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    idleEnabledRef.current = false;
    const tl = gsap.timeline({
      onComplete: () => {
        if (!isSelf && !isDimmed) idleEnabledRef.current = true;
      },
    });

    if (isSelf) {
      tl.to(
        inner.position,
        {
          x: -basePosition[0] * 0.45,
          y: 0,
          z: 1.6,
          duration: 0.6,
          ease: "power3.out",
        },
        0
      ).to(
        inner.scale,
        { x: 1.25, y: 1.25, z: 1.25, duration: 0.6, ease: "power3.out" },
        0
      );
      tl.to(
        inner.rotation,
        { y: -baseRotationY, duration: 0.6, ease: "power3.out" },
        0
      );
      if (materialRef.current) {
        tl.to(materialRef.current, { opacity: 1, duration: 0.4 }, 0);
      }
    } else {
      tl.to(
        inner.position,
        {
          x: 0,
          y: 0,
          z: isDimmed ? -0.6 : 0,
          duration: 0.6,
          ease: "power3.out",
        },
        0
      ).to(
        inner.scale,
        { x: 1, y: 1, z: 1, duration: 0.6, ease: "power3.out" },
        0
      );
      tl.to(inner.rotation, { y: 0, duration: 0.6, ease: "power3.out" }, 0);
      if (materialRef.current) {
        tl.to(
          materialRef.current,
          { opacity: isDimmed ? 0.35 : 1, duration: 0.4 },
          0
        );
      }
    }

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelf, isDimmed]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const href = `/writing/${piece.slug}`;
    const nav = () => router.push(href);
    if ("startViewTransition" in document) {
      (document as { startViewTransition: (cb: () => void) => void }).startViewTransition(nav);
    } else {
      nav();
    }
  };

  return (
    <group
      ref={anchorRef}
      position={[basePosition[0], basePosition[1], basePosition[2]]}
      rotation={[0, baseRotationY, 0]}
    >
      <group
        ref={innerRef}
        onPointerOver={() => onHover(piece.slug)}
        onPointerOut={() => onHover(null)}
      >
        <mesh>
          <planeGeometry args={[WIDTH, HEIGHT]} />
          <meshBasicMaterial
            ref={materialRef}
            map={texture}
            alphaMap={mask}
            transparent
            opacity={1}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <Html
        center
        position={[0, -HEIGHT / 2 - 0.35, 0]}
        wrapperClass="writing-card-label"
      >
        <a
          href={`/writing/${piece.slug}`}
          className={`${styles.label} ${isSelf ? styles.active : ""}`}
          onClick={handleClick}
          onPointerOver={() => onHover(piece.slug)}
          onPointerOut={() => onHover(null)}
        >
          <span className={styles.kind}>{piece.category}</span>
          <span className={styles.title}>{piece.title}</span>
        </a>
      </Html>
    </group>
  );
}
