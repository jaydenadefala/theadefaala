"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

/**
 * Loads an arbitrary uploaded image (any aspect ratio) and crops it
 * onto a canvas sized to match a target aspect ratio — the same
 * object-fit:cover a browser would do with an <img>, but done by hand
 * because a raw THREE.Texture stretches to fill whatever plane
 * geometry it's mapped onto rather than cropping. Reuses the
 * canvas-texture pattern already established in makeCardCoverTexture/
 * makeGlowTexture rather than introducing a different texture.repeat/
 * offset technique for just this one case.
 *
 * Returns null while loading, on failure, or when `src` is null/empty
 * — callers should fall back to their existing procedural texture in
 * all three cases (a broken image shouldn't blank a card).
 */
export function useImageTexture(
  src: string | null | undefined,
  aspect: number
): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!src) {
      setTexture(null);
      return;
    }

    const cacheKey = `${src}|${aspect}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      setTexture(cached);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;

      const size = 768;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = Math.round(size / aspect);
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const srcAspect = img.naturalWidth / img.naturalHeight;
        let sx = 0;
        let sy = 0;
        let sw = img.naturalWidth;
        let sh = img.naturalHeight;

        if (srcAspect > aspect) {
          // source is wider than target — crop the sides
          sw = img.naturalHeight * aspect;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          // source is taller than target — crop top/bottom
          sh = img.naturalWidth / aspect;
          sy = (img.naturalHeight - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      }

      const loaded = new THREE.CanvasTexture(canvas);
      loaded.colorSpace = THREE.SRGBColorSpace;
      cache.set(cacheKey, loaded);
      setTexture(loaded);
    };

    img.onerror = () => {
      if (!cancelled) setTexture(null);
    };

    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, aspect]);

  return texture;
}
