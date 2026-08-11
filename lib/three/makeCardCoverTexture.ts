import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

/** Darkens a #rrggbb hex color by `amount` (0..1). */
function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 255) * (1 - amount));
  const g = Math.max(0, ((n >> 8) & 255) * (1 - amount));
  const b = Math.max(0, (n & 255) * (1 - amount));
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
}

/**
 * A simple diagonal-gradient "book cover" texture from a single accent
 * color — cached per color so repeated cards (same category) share one
 * texture instead of regenerating. No title baked in: that stays real
 * DOM text via Html, for accessibility and crispness.
 */
export function makeCardCoverTexture(accent: string): THREE.Texture {
  const existing = cache.get(accent);
  if (existing) return existing;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = Math.round((size * 4) / 3);
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, accent);
    gradient.addColorStop(1, shade(accent, 0.45));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  cache.set(accent, texture);
  return texture;
}
