import * as THREE from "three";

let cached: THREE.Texture | null = null;

/**
 * A soft radial-gradient sprite texture, generated once and cached —
 * gives point lights a believable glow without a full postprocessing
 * bloom pass (which we're deliberately not adding — see Milestone 1
 * risk notes on keeping the dependency/perf footprint small).
 */
export function makeGlowTexture(): THREE.Texture {
  if (cached) return cached;

  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(201,162,75,0.65)");
    gradient.addColorStop(1, "rgba(201,162,75,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  cached = new THREE.CanvasTexture(canvas);
  return cached;
}
