import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

/**
 * Alpha mask for a rounded-rect "book/card" silhouette — same technique
 * as makePillMask but with a tunable corner radius instead of a full
 * stadium shape, for content tiles that read as book covers rather than
 * portraits. Cached per radius ratio since every card in a gallery
 * shares the same shape.
 */
export function makeRoundedRectMask(radiusRatio = 0.08): THREE.Texture {
  const key = radiusRatio.toFixed(3);
  const existing = cache.get(key);
  if (existing) return existing;

  const width = 512;
  const height = 683; // 3:4
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const radius = Math.min(width, height) * radiusRatio;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, radius);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  cache.set(key, texture);
  return texture;
}
