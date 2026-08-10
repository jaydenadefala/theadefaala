"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

/**
 * The actual R3F <Canvas>, isolated into its own module so it can be
 * next/dynamic-imported with ssr:false from Scene.tsx — Three.js/R3F
 * internals assume a browser environment.
 */
export default function SceneCanvas({ children }: { children: ReactNode }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
    >
      {children}
    </Canvas>
  );
}
