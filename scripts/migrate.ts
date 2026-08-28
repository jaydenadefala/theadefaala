/**
 * Wrapper for Payload's migrate CLI commands (migrate:create, migrate,
 * migrate:status) against Postgres. Necessary, not optional — discovered
 * live, not assumed: Neon's pooled connection string (the one this
 * project's DATABASE_URL holds, and the one Vercel's runtime should
 * keep using) runs through pgbouncer in transaction-pooling mode, which
 * doesn't support the session-level behavior Payload/drizzle's
 * migration commands need. Confirmed directly against this project's
 * own Neon database: `payload migrate:status` hung indefinitely against
 * the pooled host, while a plain `pg` client connected against the
 * same database's DIRECT (unpooled) host in ~3s every time.
 *
 * Neon's own docs recommend exactly this split: pooled for application
 * runtime (many short-lived serverless connections — keep DATABASE_URL
 * as-is in Vercel), direct/unpooled for migrations and other
 * long-lived/session-dependent tools. Neon's pooled hostnames are
 * always `<id>-pooler.<region>.aws.neon.tech`; the direct host is the
 * identical string with "-pooler" removed — this wrapper derives it in
 * memory and overrides DATABASE_URL for the spawned CLI process only.
 * Nothing else (next dev, next build, the real app) is affected: this
 * script never modifies .env.local, only this one child process's env.
 *
 * If DATABASE_URL isn't a pooled Neon URL (SQLite locally, or a
 * Postgres host without "-pooler"), it's used unmodified — this is a
 * safe no-op outside the specific case it exists for.
 *
 * Usage: npm run migrate:create <name> | npm run migrate | npm run migrate:status
 */
import { config as loadEnv } from "dotenv";
import { spawnSync } from "child_process";

loadEnv({ path: ".env.local" });

const rawUrl = process.env.DATABASE_URL;
let migrationUrl = rawUrl;

if (rawUrl && rawUrl.includes("-pooler")) {
  const u = new URL(rawUrl);
  u.hostname = u.hostname.replace("-pooler", "");
  migrationUrl = u.toString();
  console.log("Using Neon's direct (unpooled) endpoint for this migration command.");
}

const args = process.argv.slice(2);
const result = spawnSync("npx", ["payload", ...args], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, DATABASE_URL: migrationUrl },
});

process.exit(result.status ?? 1);
