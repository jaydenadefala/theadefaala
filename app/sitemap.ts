import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { getWritingPieces } from "@/lib/payload/writing";
import { getPoems } from "@/lib/payload/poems";
import { getDevelopmentProjects } from "@/lib/payload/development";
import { getMessages } from "@/lib/payload/preacher";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pieces, poems, projects, messages] = await Promise.all([
    getWritingPieces(),
    getPoems(),
    getDevelopmentProjects(),
    getMessages(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/writing`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/poetry`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/development`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/preacher`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/connect`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const detailRoutes: MetadataRoute.Sitemap = [
    ...pieces.map((p) => ({
      url: `${SITE_URL}/writing/${p.slug}`,
      lastModified: p.publishedAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...poems.map((p) => ({
      url: `${SITE_URL}/poetry/${p.slug}`,
      lastModified: p.publishedAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/development/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...messages.map((m) => ({
      url: `${SITE_URL}/preacher/${m.slug}`,
      lastModified: m.date ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...detailRoutes];
}
