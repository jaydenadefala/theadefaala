"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import ParticleField from "@/components/three/ParticleField";
import WritingCard from "./WritingCard";
import type { WritingPiece } from "@/content/writing";

/** Fan/constellation layout: spread across a shallow arc facing the
 *  camera, alternating depth and a little vertical variance so it
 *  reads as a loose cluster of objects rather than a straight row. */
function useConstellationLayout(count: number) {
  return useMemo(() => {
    const angleSpread = Math.PI * 0.85;
    const startAngle = -angleSpread / 2;
    const step = count > 1 ? angleSpread / (count - 1) : 0;

    return Array.from({ length: count }, (_, i) => {
      const angle = startAngle + step * i;
      const radius = 3.4 + (i % 2 === 0 ? 0 : 0.7);
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius * 0.55;
      const y = ((i % 3) - 1) * 0.35;
      return {
        position: [x, y, z] as const,
        rotationY: -angle * 0.6,
      };
    });
  }, [count]);
}

function CameraParallax() {
  const pointer = useRef({ x: 0, y: 0 });

  useMemo(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ camera }) => {
    const targetX = pointer.current.x * 0.6;
    const targetY = -pointer.current.y * 0.4 + 0.2;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0.2, 0);
  });

  return null;
}

interface WritingGallerySceneProps {
  pieces: WritingPiece[];
}

export default function WritingGalleryScene({ pieces }: WritingGallerySceneProps) {
  const sorted = useMemo(
    () => [...pieces].sort((a, b) => a.displayOrder - b.displayOrder),
    [pieces]
  );
  const layout = useConstellationLayout(sorted.length);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <>
      <CameraParallax />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={0.7} />
      <ParticleField count={140} spread={{ x: 8, y: 5 }} depthRange={[-3, -7]} opacity={0.25} />

      {sorted.map((piece, i) => (
        <WritingCard
          key={piece.slug}
          piece={piece}
          basePosition={layout[i].position}
          baseRotationY={layout[i].rotationY}
          isSelf={hoveredSlug === piece.slug}
          isDimmed={hoveredSlug !== null && hoveredSlug !== piece.slug}
          onHover={setHoveredSlug}
        />
      ))}
    </>
  );
}
