"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

interface LoadedTexture {
  src: string;
  aspect: number;
  texture: THREE.Texture;
}

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
  const [loaded, setLoaded] = useState<LoadedTexture | null>(null);

  // Reading the cache is a pure, deterministic lookup given the same
  // key — safe to do directly during render, no effect/state round
  // trip needed for the (common, after the first load) cache-hit path.
  const cacheKey = src ? `${src}|${aspect}` : null;
  const cachedTexture = cacheKey ? cache.get(cacheKey) : undefined;

  useEffect(() => {
    if (!src || cachedTexture) return;

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

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      cache.set(cacheKey!, texture);
      setLoaded({ src, aspect, texture });
    };

    img.onerror = () => {
      if (!cancelled) setLoaded(null);
    };

    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, aspect, cachedTexture, cacheKey]);

  if (cachedTexture) return cachedTexture;

  // Derived, not effect-reset: only return the loaded texture if it
  // actually matches the CURRENT src/aspect. Naturally falls back to
  // null the instant src changes (no stale-texture flash while the
  // new load is in flight), without a separate synchronous
  // setState(null) call in the effect body for the "no src" case.
  return loaded && loaded.src === src && loaded.aspect === aspect
    ? loaded.texture
    : null;
}
