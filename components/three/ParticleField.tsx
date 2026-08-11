"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";

interface ParticleFieldProps {
  count?: number;
  /** Half-extents of the box the particles are scattered within. */
  spread?: { x: number; y: number };
  /** [near, far] range along -z, since the field always sits behind the subject. */
  depthRange?: [number, number];
  color?: string;
  size?: number;
  opacity?: number;
}

/**
 * Sparse atmospheric dust — a depth layer that drifts independently of
 * whatever's in front of it. Shared between the opening scene and the
 * persistent chapter background (ChapterWorld); a couple hundred points
 * is nothing next to a texture or DOM overlay, so it's cheap to reuse
 * wherever a scene wants a sense of atmosphere.
 */
export default function ParticleField({
  count = 160,
  spread = { x: 16, y: 9 },
  depthRange = [-2.5, -7],
  color = "#a7a49c",
  size = 0.018,
  opacity = 0.35,
}: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const [near, far] = depthRange;
    const depthSpan = far - near;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 2 * spread.x;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2 * spread.y;
      arr[i * 3 + 2] = near + Math.random() * depthSpan;
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, spread.x, spread.y, depthRange[0], depthRange[1]]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.006;
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  );
}
