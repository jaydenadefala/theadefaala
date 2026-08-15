/**
 * Shared "pick the featured one" rule for homepage teasers: prefer the
 * doc explicitly marked featured in the CMS, otherwise fall back to
 * whatever's first by displayOrder so a chapter never has nothing to
 * show just because no one has flipped the featured toggle yet.
 */
export function pickFeatured<T extends { featured: boolean }>(
  items: T[]
): T | undefined {
  return items.find((item) => item.featured) ?? items[0];
}
