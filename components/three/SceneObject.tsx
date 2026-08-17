"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";

export interface FocusTransform {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  rotationY?: number;
}

const DEFAULT_FOCUS: Required<FocusTransform> = {
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  rotationY: 0,
};

interface SceneObjectProps {
  basePosition: readonly [number, number, number];
  baseRotationY?: number;
  width: number;
  height: number;
  texture: THREE.Texture;
  mask: THREE.Texture;
  isFocused: boolean;
  isDimmed: boolean;
  /** Local-offset transform the inner group animates to when focused. */
  focusTransform?: FocusTransform;
  /** How far a dimmed (sibling-focused) object recedes in local z. */
  dimRecede?: number;
  /** Idle wobble speed multiplier; 0 disables idle motion entirely. */
  idleSpeed?: number;
  idleAmplitude?: number;
  /**
   * Writing's original behavior: idle only resumes for a neutral card
   * (neither focused nor dimmed) once its transition settles — a
   * dimmed sibling stays still until it's neutral again. Poetry wants
   * the opposite: every card, focused or not, keeps drifting — "a
   * corridor at rest," never fully static. Default false matches
   * Writing (the primitive's origin); Poetry opts in explicitly.
   */
  alwaysIdle?: boolean;
  focusDuration?: number;
  opacityDuration?: number;
  labelPosition: readonly [number, number, number];
  label: ReactNode;
  onMeshHover: (hovered: boolean) => void;
}

/**
 * The shared "physical object" primitive: a textured plane that idles
 * gently at rest, snaps toward the camera when focused, and recedes +
 * dims when a sibling is focused instead. Extracted from the original
 * WritingCard (Experience Architecture milestone) so Writing and
 * Poetry share real interaction code — not two parallel hand-tuned
 * GSAP timelines that quietly drift apart over time.
 *
 * Owns only the mesh + its physics. The Html label is a full render
 * slot so each gallery keeps its own markup, class names, and click
 * handling (via useChapterTransition) rather than this primitive
 * dictating them.
 */
export default function SceneObject({
  basePosition,
  baseRotationY = 0,
  width,
  height,
  texture,
  mask,
  isFocused,
  isDimmed,
  focusTransform,
  dimRecede = -0.6,
  idleSpeed = 0.4,
  idleAmplitude = 0.08,
  alwaysIdle = false,
  focusDuration = 0.6,
  opacityDuration = 0.4,
  labelPosition,
  label,
  onMeshHover,
}: SceneObjectProps) {
  const innerRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  // Lazy useState initializer, not useRef(Math.random()...): a plain
  // useRef re-evaluates its argument expression on every render (only
  // the first result is ever used, but Math.random() still runs every
  // time) — React's guidance is a lazy initializer for exactly this.
  const [idleOffset] = useState(() => Math.random() * Math.PI * 2);
  const idleEnabledRef = useRef(idleSpeed > 0);

  useFrame(({ clock }) => {
    if (idleSpeed <= 0 || !innerRef.current || !idleEnabledRef.current) return;
    const t = clock.elapsedTime * idleSpeed + idleOffset;
    innerRef.current.position.y = Math.sin(t) * idleAmplitude;
    innerRef.current.rotation.y = Math.sin(t * 0.6) * (idleAmplitude * 0.5);
  });

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    idleEnabledRef.current = false;
    const focus = { ...DEFAULT_FOCUS, ...focusTransform };
    const tl = gsap.timeline({
      onComplete: () => {
        const shouldResume = alwaysIdle || (!isFocused && !isDimmed);
        if (shouldResume && idleSpeed > 0) idleEnabledRef.current = true;
      },
    });

    if (isFocused) {
      tl.to(
        inner.position,
        { x: focus.x, y: focus.y, z: focus.z, duration: focusDuration, ease: "power3.out" },
        0
      )
        .to(
          inner.scale,
          { x: focus.scale, y: focus.scale, z: focus.scale, duration: focusDuration, ease: "power3.out" },
          0
        )
        .to(inner.rotation, { y: focus.rotationY, duration: focusDuration, ease: "power3.out" }, 0);
      if (materialRef.current) {
        tl.to(materialRef.current, { opacity: 1, duration: opacityDuration }, 0);
      }
    } else {
      tl.to(
        inner.position,
        { x: 0, y: 0, z: isDimmed ? dimRecede : 0, duration: focusDuration, ease: "power3.out" },
        0
      )
        .to(inner.scale, { x: 1, y: 1, z: 1, duration: focusDuration, ease: "power3.out" }, 0)
        .to(inner.rotation, { y: 0, duration: focusDuration, ease: "power3.out" }, 0);
      if (materialRef.current) {
        tl.to(
          materialRef.current,
          { opacity: isDimmed ? 0.35 : 1, duration: opacityDuration },
          0
        );
      }
    }

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, isDimmed]);

  return (
    <group
      position={[basePosition[0], basePosition[1], basePosition[2]]}
      rotation={[0, baseRotationY, 0]}
    >
      <group
        ref={innerRef}
        onPointerOver={() => onMeshHover(true)}
        onPointerOut={() => onMeshHover(false)}
      >
        <mesh>
          <planeGeometry args={[width, height]} />
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

      <Html center position={labelPosition} wrapperClass="scene-object-label">
        {label}
      </Html>
    </group>
  );
}
