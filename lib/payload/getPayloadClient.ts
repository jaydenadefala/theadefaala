import { getPayload, type Payload } from "payload";
import config from "@payload-config";

/**
 * The ONLY file allowed to import `payload` outside of the (payload)
 * route group and scripts/. Every adapter in lib/payload/* goes through
 * this cached client — no component, page, or R3F scene ever talks to
 * Payload directly. That boundary is what makes it possible to replace
 * Payload later without touching a single visual component.
 */
let cached: Promise<Payload> | null = null;

export function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config });
  }
  return cached;
}
