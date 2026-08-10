import * as THREE from "three";

let cached: THREE.Texture | null = null;

/**
 * Alpha mask that turns a plain rectangular plane into the same
 * "pill" silhouette (border-radius: 999px on a 3:4 box → fully rounded
 * top/bottom, straight sides) the DOM fallback gets for free from CSS
 * clip-path. Used as a material's alphaMap rather than reaching for
 * custom rounded-rect geometry + matching UVs.
 */
export function makePillMask(): THREE.Texture {
  if (cached) return cached;

  const width = 512;
  const height = Math.round((width * 4) / 3);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // radius = width/2: top-left+top-right corners exactly span the full
    // width, meeting seamlessly as one semicircle (same on the bottom) —
    // the same silhouette as the DOM version's border-radius: 999px.
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, width / 2);
    ctx.fill();
  }

  cached = new THREE.CanvasTexture(canvas);
  return cached;
}
