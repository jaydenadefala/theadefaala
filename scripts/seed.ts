/**
 * Seeds Payload's content collections from the existing content/*.ts
 * files — same data, same honest "draft/coming soon" state, just moved
 * into the CMS so the admin has real rows to show and edit. Does NOT
 * touch the Users collection: creating the first admin account (email +
 * password) is a step you do yourself at /admin, never scripted here.
 *
 * Safe to re-run — skips any record whose slug already exists.
 *
 * Usage: npm run seed
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { WRITING_PIECES } from "../content/writing";
import { POEMS } from "../content/poetry";
import { DEVELOPMENT_PROJECTS } from "../content/development";
import { PREACHER_MESSAGES } from "../content/preacher";

// Dynamic imports below are deliberate: payload.config.ts reads
// process.env.PAYLOAD_SECRET at module-evaluation time via
// buildConfig(), and static top-level imports are hoisted before the
// loadEnv() call above regardless of source order (standard ESM
// semantics) — so a static `import config from "../payload.config"`
// here would always see an empty secret. Dynamic import() runs at the
// point it's awaited, after env vars are loaded.
async function main() {
  const { getPayload } = await import("payload");
  const { default: config } = await import("../payload.config");
  const payload = await getPayload({ config });

  async function seedCollection<T extends { slug: string }>(
    collection: "writing" | "poems" | "development-projects" | "preacher-messages",
    items: T[],
    toDoc: (item: T) => Record<string, unknown>
  ) {
    let created = 0;
    let skipped = 0;

    for (const item of items) {
      const existing = await payload.find({
        collection,
        where: { slug: { equals: item.slug } },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        skipped++;
        continue;
      }

      await payload.create({
        collection,
        data: toDoc(item),
        draft: true,
      });
      created++;
    }

    console.log(`  ${collection}: ${created} created, ${skipped} already existed`);
  }

  console.log("Seeding content collections...");

  await seedCollection("writing", WRITING_PIECES, (p) => ({
    title: p.title,
    slug: p.slug,
    subtitle: p.subtitle,
    excerpt: p.excerpt,
    category: p.category,
    accent: p.accent,
    featured: p.featured,
    displayOrder: p.displayOrder,
  }));

  await seedCollection("poems", POEMS, (p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    mood: p.mood,
    lines: p.lines.map((text) => ({ text })),
    featured: p.featured,
    displayOrder: p.displayOrder,
  }));

  await seedCollection("development-projects", DEVELOPMENT_PROJECTS, (p) => ({
    name: p.name,
    slug: p.slug,
    category: p.category,
    shortDescription: p.shortDescription,
    role: p.role,
    technologies: p.technologies.map((value) => ({ value })),
    externalUrl: p.externalUrl || undefined,
    githubUrl: p.githubUrl || undefined,
    businessContext: p.businessContext || undefined,
    featured: p.featured,
    displayOrder: p.displayOrder,
  }));

  await seedCollection("preacher-messages", PREACHER_MESSAGES, (p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    scripture: p.scripture || undefined,
    category: p.category,
    date: p.date || undefined,
    featured: p.featured,
    displayOrder: p.displayOrder,
  }));

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
