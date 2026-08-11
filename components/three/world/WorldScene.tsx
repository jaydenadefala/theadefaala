"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleField from "@/components/three/ParticleField";

interface WorldSceneProps {
  /** 0..1 scroll progress through the whole chapter stack, mutated by
   *  ChapterWorld's ScrollTrigger and read here every frame — plain
   *  ref, not React state, so scrolling never triggers a re-render. */
  progressRef: RefObject<number>;
}

// Each chapter's accent, sampled continuously across the scroll range
// so the background *transitions* through them rather than cutting.
const TINT_STOPS: Array<[number, THREE.Color]> = [
  [0, new THREE.Color("#c9a24b")], // Writing — warm gold
  [0.28, new THREE.Color("#8fa896")], // Development — cooling toward sage
  [0.52, new THREE.Color("#8fa896")], // Poetry — sage, held
  [0.76, new THREE.Color("#4a4a4d")], // Preacher — desaturated, dim
  [1, new THREE.Color("#c9a24b")], // Connect — warm gold, resolved
];

function sampleTint(t: number, target: THREE.Color) {
  for (let i = 0; i < TINT_STOPS.length - 1; i++) {
    const [t0, c0] = TINT_STOPS[i];
    const [t1, c1] = TINT_STOPS[i + 1];
    if (t >= t0 && t <= t1) {
      const local = (t - t0) / (t1 - t0 || 1);
      target.copy(c0).lerp(c1, local);
      return;
    }
  }
  target.copy(TINT_STOPS[TINT_STOPS.length - 1][1]);
}

export default function WorldScene({ progressRef }: WorldSceneProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const tintScratch = useRef(new THREE.Color());

  useFrame(({ camera }) => {
    const p = progressRef.current ?? 0;

    // Gentle continuous dolly + slight downward drift — the "moving
    // through the world" cue, deliberately subtle so it reads as
    // atmosphere rather than motion sickness.
    const targetZ = 5.5 - p * 1.5;
    const targetY = -p * 0.8;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, camera.position.y, 0);

    if (lightRef.current) {
      sampleTint(p, tintScratch.current);
      lightRef.current.color.copy(tintScratch.current);
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={lightRef} position={[0, 0, 3]} intensity={1.2} />
      <ParticleField
        count={220}
        spread={{ x: 9, y: 14 }}
        depthRange={[-2, -8]}
        opacity={0.3}
      />
    </>
  );
}
