/**
 * Run this after editing any collection's fields (payload.config.ts's
 * `push` is off by default — see the comment there for why). Safe to
 * re-run; only applies to local SQLite dev, never touches production.
 *
 * Usage: npm run db:push
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
process.env.PAYLOAD_PUSH_SCHEMA = "true";

async function main() {
  const { getPayload } = await import("payload");
  const { default: config } = await import("../payload.config");
  await getPayload({ config });
  console.log("Schema pushed.");
  process.exit(0);
}

main();
