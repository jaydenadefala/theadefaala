"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

/**
 * Same graceful-degradation contract as the DOM fallback's Image()
 * probe: load the real photo if it exists, and if it 404s (no photo
 * dropped in yet), draw an equivalent "TA" monogram as a canvas texture
 * instead of leaving the plane blank or throwing. Returns null while
 * loading so callers can gate their entrance timeline on a real value.
 */
export function usePhotoTexture(src: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();

    loader.load(
      src,
      (loaded) => {
        if (cancelled) return;
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.needsUpdate = true;
        setTexture(loaded);
      },
      undefined,
      () => {
        if (cancelled) return;
        setTexture(makeMonogramTexture());
      }
    );

    return () => {
      cancelled = true;
    };
  }, [src]);

  return texture;
}

function makeMonogramTexture(): THREE.Texture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = (size * 4) / 3; // matches the fallback's 3:4 aspect ratio

  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#c9a24b"); // --accent
    gradient.addColorStop(1, "#8fa896"); // --highlight
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#08090b"; // --bg
    ctx.font = `600 ${size * 0.28}px Georgia, "Times New Roman", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("TA", canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
