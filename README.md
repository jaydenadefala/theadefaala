# theAdefala

The personal site of theAdefala — developer, writer, poet, and preacher. A
cinematic, spatial (Three.js / React Three Fiber) identity experience across
four content verticals (Writing, Poetry, Development, Preacher), backed by a
self-hosted [Payload CMS](https://payloadcms.com) so every piece of content
is editable through an admin UI, not a code change.

Built on Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind
CSS 4, GSAP, and React Three Fiber.

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in PAYLOAD_SECRET (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The public site loads
immediately; `/admin` is the Payload admin panel.

### Required environment variables

See `.env.example` for the full list with descriptions. The two that matter
locally:

- `PAYLOAD_SECRET` — any long random string, e.g. `openssl rand -base64 32`.
  Signs admin auth sessions. Generate a fresh one per environment; never
  reuse the same value between local/staging/production.
- `DATABASE_URL` — defaults to `file:./payload.db` (SQLite) if unset, which
  is fine for local dev.

### Development database (SQLite)

Local dev uses SQLite (`@payloadcms/db-sqlite`) — zero setup, just a file on
disk (`payload.db`, gitignored). The first time you run the app, Payload
creates the file and schema automatically.

**After editing any collection's or global's fields** (adding/removing a
field in `collections/*.ts` or `globals/*.ts`), run:

```bash
npm run db:push
```

This pushes the schema change to your local SQLite database. It's a
separate manual step — not automatic on every `npm run dev` — because
Payload's automatic dev-mode schema push has a known, reproducible bug in
this stack (drizzle-kit's SQLite diff logic; see the comment above `db:push`
in `scripts/push-schema.ts` and in `payload.config.ts` for the full
explanation). `db:push` sets `PAYLOAD_PUSH_SCHEMA=true` for that one run
only, so normal `dev`/`build` runs never hit the bug.

To seed the four content collections with their initial (honestly
draft/placeholder) records:

```bash
npm run seed
```

`seed` is idempotent — safe to re-run, it skips any record whose slug
already exists.

### Payload admin setup

The first admin account is **never created by a script** — do this yourself,
by design (nothing in this repo can create an account for you):

1. `npm run dev`
2. Visit `http://localhost:3000/admin`
3. Payload's first-run screen prompts you to create the initial admin user
   (email + password).

From there, everything — Writing, Poetry, Development projects, Preacher
messages, Media, and the two site-wide settings globals (Site Settings,
Homepage Settings) — is manageable entirely through that admin UI. No
content in this project should ever require a code change or a redeploy to
add/edit/publish.

### Build

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc, standalone (also runs as part of `build`)
```

All three (`build`, `lint`, `typecheck`) are expected to pass with zero
errors before merging/deploying.

## Deployment notes

### Production database: PostgreSQL required

**SQLite is a local development convenience only — not a production
persistence strategy.** A deployed filesystem (most serverless/container
hosts) is ephemeral or not safely shared across instances, so a SQLite file
written to disk in production will not reliably persist.

The database adapter in `payload.config.ts` is selected automatically from
`DATABASE_URL`'s scheme — no other code change needed:

- `file:...` → SQLite (`@payloadcms/db-sqlite`) — local dev.
- `postgres://...` or `postgresql://...` → PostgreSQL
  (`@payloadcms/db-postgres`) — production.

Every collection/global field is defined through Payload's own schema DSL
(never raw SQL), which is what makes this a one-variable swap rather than a
rewrite. In production, set `DATABASE_URL` to a real Postgres connection
string (Neon, Supabase, Railway, RDS, etc. all work — any standard Postgres
connection string), then run Payload's migration flow for that database
before first boot.

**Not yet live-tested against a real Postgres instance** — no Postgres
server was available in the environment this was built in. The code path
compiles and type-checks cleanly and mirrors the SQLite adapter's shape
exactly, but treat it as code-ready, not yet verified end-to-end, until
someone runs it against a real Postgres database once.

### Production media storage: Cloudflare R2 (S3-compatible)

Uploads (`collections/Media.ts`) write to local disk (`upload.staticDir:
"media"`, gitignored) **only when no S3-compatible storage is configured** —
that's the local dev default, and it works fine there. Like SQLite, local
disk is not durable on most production hosts (ephemeral/non-shared
filesystems), so production needs real object storage.

`payload.config.ts` registers `@payloadcms/storage-s3` (Payload's official
S3-compatible storage plugin) and switches Media over to it automatically
based on whether these four env vars are all set:

- `S3_BUCKET`
- `S3_ENDPOINT` — for Cloudflare R2:
  `https://<account-id>.r2.cloudflarestorage.com`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_REGION` — optional, defaults to `auto` (correct for R2; set a real AWS
  region only when pointing at actual S3)

Leave all four unset locally and Media keeps using local disk exactly as
before — verified by reading the plugin's own source: with no config
present the plugin resolves to a no-op that returns Payload's config
untouched, no S3 client is ever constructed. Cloudflare R2 is this
project's target provider (it's S3-compatible, so `@payloadcms/storage-s3`
talks to it directly with `forcePathStyle: true`), but the same code path
works against real AWS S3 or any other S3-compatible endpoint without
changes — only the env vars differ.

**Not yet live-tested against a real bucket** — no R2/S3 credentials were
available in the environment this was built in. The plugin wiring is
code-ready and the local (disabled) path is verified working, but treat the
enabled path as unverified until it's run against a real bucket once.

To set this up: create an R2 bucket and an API token scoped to it in the
Cloudflare dashboard, then set the four env vars above in your production
environment (never in a committed file).

### Environment variables in production

- `PAYLOAD_SECRET` — a fresh, long random value, different from local/dev.
- `DATABASE_URL` — a real `postgres://` connection string.
- `NEXT_PUBLIC_SITE_URL` — the real public origin (used for
  sitemap/robots/canonical URLs and Open Graph absolute image URLs).
- `PAYLOAD_PUSH_SCHEMA` — leave unset/`false`. Use Payload's proper
  migration commands for schema changes against a production Postgres
  database instead.

### Admin authentication

Payload's own session-based auth — no custom/fake auth layer anywhere in
this codebase. Every collection and global has explicit, server-enforced
`access` rules (not client-side-only); public read is intentional
(including drafts, so "coming soon" pages work without auth) while
create/update/delete require an authenticated session on every content
collection and global.
