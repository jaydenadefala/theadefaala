/**
 * Real capability check, not a feature-sniff. Some browsers expose
 * `WebGLRenderingContext` but still fail to actually create a context
 * (disabled via flags, blocklisted GPU, out of memory), so this attempts
 * a real context creation and catches the failure.
 */
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}
