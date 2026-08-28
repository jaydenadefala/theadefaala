import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
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
      // Discovered live against a real Neon database, not assumed:
      // @payloadcms/db-postgres's connect() only skips dev-mode auto
      // schema push when NODE_ENV === 'production' AND push !== false
      // (see node_modules/@payloadcms/db-postgres/dist/connect.js) —
      // `next dev` never sets NODE_ENV=production, so without this
      // flag, pointing DATABASE_URL at Neon and running `npm run dev`
      // (or any local script) would trigger drizzle-kit's schema
      // introspection/diff against Neon on every connect. That's the
      // same class of bug already worked around for SQLite below, but
      // worse here: Neon is the real, persistent, shared database, and
      // an uncontrolled auto-diff against it is exactly what the
      // project's migration workflow (migrations/, `payload migrate`)
      // exists to prevent. Confirmed live: with this unset, a plain
      // Payload local-API script against Neon hung ~90s introspecting
      // the schema, then crashed with an uncaught "Connection
      // terminated unexpectedly" — almost certainly drizzle-kit's
      // introspection colliding with Neon's pooled (pgbouncer) endpoint.
      // Schema changes on Postgres always go through the formal
      // migration commands now: `npm run payload migrate:create <name>`
      // then `npm run payload migrate` — never auto-push.
      push: false,
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
 * LOCAL: Media.staticDir (local disk) — untouched, zero setup. PRODUCTION:
 * any S3-compatible object store (Cloudflare R2 is the target — see
 * README — but this works unmodified against real AWS S3 or any other
 * S3-compatible endpoint too), selected the same way the DB adapter is:
 * by whether the required env vars are actually present, not a separate
 * flag to keep in sync.
 *
 * When S3_BUCKET/S3_ENDPOINT/S3_ACCESS_KEY_ID/S3_SECRET_ACCESS_KEY are
 * unset (every local dev environment), `enabled: false` makes this
 * plugin a verified no-op — it returns Payload's config completely
 * unmodified (confirmed by reading @payloadcms/storage-s3's and
 * @payloadcms/plugin-cloud-storage's source directly, not assumed): no
 * S3 client is constructed, no network call is attempted, and
 * Media.upload.staticDir keeps working exactly as before. Only a real
 * production environment with these four vars set actually switches
 * Media's storage.
 */
const hasS3Config = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
);

const mediaStorage = s3Storage({
  enabled: hasS3Config,
  collections: { media: true },
  bucket: process.env.S3_BUCKET || "",
  config: {
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    // R2 (and most non-AWS S3-compatible stores) need path-style URLs,
    // not AWS's virtual-hosted-style — harmless against real AWS S3 too.
    forcePathStyle: true,
  },
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
  plugins: [mediaStorage],
});
