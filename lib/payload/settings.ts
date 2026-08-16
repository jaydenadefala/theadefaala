import { getPayloadClient } from "./getPayloadClient";
import { resolveMediaUrl } from "./media";
import type { SiteSettingsData, HomepageSettingsData } from "@/content/settings";

/**
 * Fallbacks mirror the exact defaultValue already declared on each
 * Payload field — not separately-invented content — used only if a
 * global somehow returns without a value (shouldn't happen once
 * Payload has initialized it once, but globals.findGlobal never 404s
 * the way a missing document would).
 */
const SITE_SETTINGS_FALLBACK: SiteSettingsData = {
  siteTitle: "theAdefala",
  siteDescription:
    "The personal universe of theAdefala: developer, writer, poet, and preacher.",
  email: "jaydenadefala@gmail.com",
  profileImage: null,
  socialLinks: [],
};

const HOMEPAGE_SETTINGS_FALLBACK: HomepageSettingsData = {
  identityRoles: ["Developer", "Writer", "Poet", "Preacher"],
  ctaHeadline: "If any of this resonated, let's talk.",
  ctaButtonText: "Say hello",
  ctaSecondaryText: "or email directly",
  copyrightName: "theAdefala",
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "site-settings", depth: 1 });
  return {
    siteTitle: doc.siteTitle || SITE_SETTINGS_FALLBACK.siteTitle,
    siteDescription: doc.siteDescription || SITE_SETTINGS_FALLBACK.siteDescription,
    email: doc.email || SITE_SETTINGS_FALLBACK.email,
    profileImage: resolveMediaUrl(doc.profileImage),
    socialLinks: (doc.socialLinks ?? []).map((l) => ({ label: l.label, url: l.url })),
  };
}

export async function getHomepageSettings(): Promise<HomepageSettingsData> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "homepage-settings" });
  const roles = (doc.identityRoles ?? []).map((r) => r.label);
  return {
    identityRoles: roles.length > 0 ? roles : HOMEPAGE_SETTINGS_FALLBACK.identityRoles,
    ctaHeadline: doc.ctaHeadline || HOMEPAGE_SETTINGS_FALLBACK.ctaHeadline,
    ctaButtonText: doc.ctaButtonText || HOMEPAGE_SETTINGS_FALLBACK.ctaButtonText,
    ctaSecondaryText: doc.ctaSecondaryText || HOMEPAGE_SETTINGS_FALLBACK.ctaSecondaryText,
    copyrightName: doc.copyrightName || HOMEPAGE_SETTINGS_FALLBACK.copyrightName,
  };
}
