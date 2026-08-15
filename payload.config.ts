import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Writing } from "./collections/Writing";
import { Poems } from "./collections/Poems";
import { DevelopmentProjects } from "./collections/DevelopmentProjects";
import { PreacherMessages } from "./collections/PreacherMessages";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Payload owns data/auth/media only — it never renders anything a
 * visitor sees. The public site's React/R3F/GSAP experience layer
 * consumes this through a plain adapter (lib/payload/*, Milestone 11),
 * never importing `payload` directly into a presentational component.
 *
 * DB adapter is the one deliberately swappable piece: SQLite here for
 * local dev, @payloadcms/db-postgres for production later. Every field
 * below is defined through Payload's own schema DSL, not raw SQL, so
 * that swap is a config change, not a rewrite.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Writing, Poems, DevelopmentProjects, PreacherMessages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./payload.db",
    },
  }),
  sharp,
});
