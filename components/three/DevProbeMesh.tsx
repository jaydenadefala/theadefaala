"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

/**
 * Temporary proof-of-pipeline object for the Milestone 1 capability
 * check. Not part of any real chapter — delete alongside
 * app/dev/scene-check once Milestone 2 wires the actual opening scene.
 */
export default function DevProbeMesh() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.45;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#c9a24b" wireframe />
      </mesh>
    </>
  );
}
