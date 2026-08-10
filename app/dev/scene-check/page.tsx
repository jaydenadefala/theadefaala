import type { Metadata } from "next";
import Scene from "@/components/three/Scene";
import DevProbeMesh from "@/components/three/DevProbeMesh";

// Internal-only, unlinked verification route for the Milestone 1
// spatial scaffolding. Remove once Milestone 2 wires the real opening
// scene into this Scene/SceneCanvas pipeline.
export const metadata: Metadata = {
  title: "Scene check (internal)",
  robots: { index: false, follow: false },
};

export default function SceneCheckPage() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "#08090b",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          color: "#f4f1ea",
          fontFamily: "monospace",
          fontSize: 12,
          maxWidth: 360,
          lineHeight: 1.5,
        }}
      >
        Milestone 1 internal check: R3F pipeline + capability fallback.
        A rotating wireframe below means WebGL mounted correctly. Toggle
        OS reduced-motion to see the fallback branch.
      </div>

      <Scene
        style={{ position: "absolute", inset: 0 }}
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100svh",
              color: "#a7a49c",
              fontFamily: "monospace",
              fontSize: 13,
            }}
          >
            Fallback branch: WebGL unavailable or reduced-motion is on.
          </div>
        }
      >
        <DevProbeMesh />
      </Scene>
    </main>
  );
}
