/**
 * Domain shapes for the two site-wide Payload globals (Admin
 * milestone) — same disclosed pattern as content/*.ts's per-vertical
 * types, just backed by a single record instead of a list.
 */

export interface SiteSettingsData {
  siteTitle: string;
  siteDescription: string;
  email: string;
  profileImage: string | null;
  socialLinks: { label: string; url: string }[];
}

export interface HomepageSettingsData {
  identityRoles: string[];
  ctaHeadline: string;
  ctaButtonText: string;
  ctaSecondaryText: string;
  copyrightName: string;
}
