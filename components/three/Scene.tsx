"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { supportsWebGL } from "@/lib/three/supportsWebGL";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

interface SceneProps {
  children: ReactNode;
  /** Plain DOM/CSS content shown on the server, mid-check, for
   *  reduced-motion users, and on devices without real WebGL. */
  fallback: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Capability-gated WebGL mount point — the one place in the codebase
 * that decides whether a chapter gets its spatial version or its DOM/CSS
 * fallback. Nothing else should import @react-three/fiber directly.
 *
 * Fallback-first by design: renders the fallback on the server, during
 * the client capability check, for prefers-reduced-motion, and if a
 * real WebGL context can't actually be created — only ever upgrades to
 * the canvas, never flashes it before we know it's safe to show.
 */
export default function Scene({ children, fallback, className, style }: SceneProps) {
  const reducedMotion = useReducedMotion();
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglOk(supportsWebGL());
  }, []);

  const canRender3D = webglOk === true && !reducedMotion;

  if (!canRender3D) {
    return <>{fallback}</>;
  }

  return (
    <div className={className} style={style}>
      <SceneCanvas>{children}</SceneCanvas>
    </div>
  );
}
