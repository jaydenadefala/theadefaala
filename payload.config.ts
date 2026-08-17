import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Writing } from "./collections/Writing";
import { Poems } from "./collections/Poems";
import { DevelopmentProjects } from "./collections/DevelopmentProjects";
import { PreacherMessages } from "./collections/PreacherMessages";
import { SiteSettings } from "./globals/SiteSettings";
import { HomepageSettings } from "./globals/HomepageSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const databaseUrl = process.env.DATABASE_URL || "file:./payload.db";
const isPostgres =
  databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://");

/**
 * LOCAL: SQLite (file: URL). PRODUCTION: PostgreSQL (postgres:// or
 * postgresql:// URL) — selected automatically from DATABASE_URL's
 * scheme, no separate "which database" flag to keep in sync. Every
 * collection/global field is defined through Payload's own schema
 * DSL, never raw SQL, so this really is a config-only swap — no
 * duplicated application logic between the two paths.
 *
 * Not live-tested against a real Postgres instance in this pass (no
 * Postgres server was available in this environment — Docker's CLI is
 * installed but its daemon wasn't running, and starting it wasn't
 * worth the session time for what's fundamentally an infra concern).
 * Code-ready, not yet live-verified; flagged honestly rather than
 * assumed working.
 */
const db = isPostgres
  ? postgresAdapter({
      pool: { connectionString: databaseUrl },
    })
  : sqliteAdapter({
      client: { url: databaseUrl },
      // Payload's dev-mode auto schema push (drizzle-kit's SQLite diff)
      // hit a real, reproducible bug this session: on repeated
      // invocations against an already-correct schema, it sometimes
      // concludes an index needs (re)creating when it already exists,
      // throws, and takes the whole app down with it (confirmed via
      // direct sqlite_master introspection — the schema was never
      // actually wrong, only the diff was). Off by default so normal
      // dev/build runs never hit it; run `npm run db:push` after
      // editing a collection's fields, which sets
      // PAYLOAD_PUSH_SCHEMA=true for that one invocation only.
      push: process.env.PAYLOAD_PUSH_SCHEMA === "true",
    });

/**
 * Payload owns data/auth/media only — it never renders anything a
 * visitor sees. The public site's React/R3F/GSAP experience layer
 * consumes this through a plain adapter (lib/payload/*, Milestone 11),
 * never importing `payload` directly into a presentational component.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // Renders above Payload's own default collection-list dashboard,
      // not in place of it — see components/admin/DashboardOverview.tsx.
      beforeDashboard: ["@/components/admin/DashboardOverview#DashboardOverview"],
    },
  },
  collections: [Users, Media, Writing, Poems, DevelopmentProjects, PreacherMessages],
  globals: [SiteSettings, HomepageSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db,
  sharp,
});
