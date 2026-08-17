"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";
import { usePhotoTexture } from "@/lib/three/usePhotoTexture";
import { makeGlowTexture } from "@/lib/three/makeGlowTexture";
import { makePillMask } from "@/lib/three/makePillMask";
import { DESKTOP_QUERY } from "@/lib/motion/tokens";
import {
  IdentityOverlay,
  ScrollCue,
} from "@/app/components/opening/IdentityOverlay";
import ParticleField from "@/components/three/ParticleField";

const PHOTO_SRC = "/images/hero.jpg";
const PHOTO_ASPECT = 3 / 4;

/** Camera parallax + a gentle base dolly-in as the sequence settles. */
function CameraRig({ isDesktop }: { isDesktop: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const baseZ = isDesktop ? 5 : 6.4;

  useLayoutEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }) => {
    const targetX = pointer.current.x * 0.5;
    const targetY = -pointer.current.y * 0.35;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += (baseZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface OpeningSceneR3FProps {
  name: string;
  roles: string[];
}

export default function OpeningSceneR3F({ name, roles }: OpeningSceneR3FProps) {
  // Lazy initializer, not useState+useEffect: this component is only
  // ever mounted client-side (it's a child of Scene's ssr:false
  // dynamic import — see components/three/Scene.tsx), so there's no
  // server-rendered version to hydration-mismatch against. Reading
  // window immediately on first (guaranteed-client) render is safe.
  const [isDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);
  const [settled, setSettled] = useState(false);

  const texture = usePhotoTexture(PHOTO_SRC);
  const glowTexture = useMemo(() => makeGlowTexture(), []);
  const pillMask = useMemo(() => makePillMask(), []);

  const dotMeshRef = useRef<THREE.Mesh>(null);
  const dotGlowRef = useRef<THREE.Sprite>(null);
  const photoGroupRef = useRef<THREE.Group>(null);
  const photoMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const htmlAnchorRef = useRef<THREE.Group>(null);

  const cursorRef = useRef<HTMLSpanElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Idle wobble only takes over rotation *after* the GSAP timeline has
  // finished with these objects — no property ownership conflict.
  useFrame(({ clock }) => {
    if (!settled || !photoGroupRef.current) return;
    photoGroupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.035;
    photoGroupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.22) * 0.02;
  });

  useLayoutEffect(() => {
    if (!texture) return; // gate: wait for real photo or monogram fallback

    const settleX = isDesktop ? -1.3 : 0;
    const htmlStart = isDesktop
      ? new THREE.Vector3(1.9, 0.1, 0)
      : new THREE.Vector3(0, -1.75, 0);
    const htmlEnd = isDesktop
      ? new THREE.Vector3(1.15, 0.1, 0)
      : new THREE.Vector3(0, -1.55, 0);

    if (htmlAnchorRef.current) {
      htmlAnchorRef.current.position.copy(htmlStart);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setSettled(true),
      });

      // dot appears
      tl.fromTo(
        dotMeshRef.current!.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.4 },
        0.3
      )
        .fromTo(
          [dotMeshRef.current!.material, dotGlowRef.current!.material],
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          0.3
        )
        // dot pulses
        .to(
          dotMeshRef.current!.scale,
          { x: 1.6, y: 1.6, z: 1.6, duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" },
          0.7
        )
        // dot expands away
        .to(
          dotMeshRef.current!.scale,
          { x: 9, y: 9, z: 9, duration: 0.45, ease: "power2.in" },
          1.1
        )
        .to(
          [dotMeshRef.current!.material, dotGlowRef.current!.material],
          { opacity: 0, duration: 0.4, ease: "power2.in" },
          1.15
        )
        // photo emerges
        .fromTo(
          photoGroupRef.current!.scale,
          { x: 0.05, y: 0.05, z: 0.05 },
          { x: 1, y: 1, z: 1, duration: 0.9, ease: "power3.out" },
          1.35
        )
        .fromTo(
          photoMaterialRef.current!,
          { opacity: 0 },
          { opacity: 1, duration: 0.9 },
          1.35
        )
        // photo settles then shifts aside (desktop only)
        .to(
          photoGroupRef.current!.position,
          { x: settleX, duration: 0.6, ease: "power3.inOut" },
          2.5
        )
        // text anchor moves into its resting position, same beat as the photo
        .to(
          htmlAnchorRef.current!.position,
          { x: htmlEnd.x, y: htmlEnd.y, z: htmlEnd.z, duration: 0.6, ease: "power3.inOut" },
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
    });

    return () => ctx.revert();
  }, [texture, isDesktop]);

  const photoWidth = isDesktop ? 1.9 : 1.35;
  const photoHeight = photoWidth / PHOTO_ASPECT;

  return (
    <>
      <CameraRig isDesktop={isDesktop} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />

      <ParticleField />

      <sprite ref={dotGlowRef} scale={[0.9, 0.9, 0.9]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </sprite>
      <mesh ref={dotMeshRef} scale={[0, 0, 0]}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshBasicMaterial
          color="#c9a24b"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {texture && (
        <group ref={photoGroupRef} scale={[0.05, 0.05, 0.05]}>
          {/* TODO(Milestone 4/5 polish): plane is a fixed 3:4 box — once a
              real photo lands, adjust texture.repeat/offset from its
              naturalWidth/Height to emulate object-fit:cover instead of
              stretching. The current monogram fallback is exactly 3:4,
              so this doesn't show yet. */}
          <mesh>
            <planeGeometry args={[photoWidth, photoHeight]} />
            <meshBasicMaterial
              ref={photoMaterialRef}
              map={texture}
              alphaMap={pillMask}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      <group ref={htmlAnchorRef}>
        {/* Unlike the fallback's .stage flex row, there's no sibling here
            handing this block its width — pin one explicitly so the
            label row doesn't wrap mid-word on desktop. */}
        <Html center wrapperClass="opening-html-overlay">
          <div style={{ width: "min(90vw, 460px)" }}>
            <IdentityOverlay
              name={name}
              roles={roles}
              letterRefs={letterRefs}
              labelRefs={labelRefs}
              cursorRef={cursorRef}
            />
          </div>
        </Html>
      </group>

      <Html
        fullscreen
        style={{ pointerEvents: "none" }}
        wrapperClass="opening-scrollcue-overlay"
      >
        <ScrollCue scrollCueRef={scrollCueRef} />
      </Html>
    </>
  );
}
