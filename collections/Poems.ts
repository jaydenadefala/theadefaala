import type { CollectionConfig } from "payload";
import { authenticated } from "../access/authenticated";

/** Mirrors content/poetry.ts's PoemPiece + MOOD_STYLES shape. */
export const Poems: CollectionConfig = {
  slug: "poems",
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "mood", "_status", "displayOrder"],
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "excerpt", type: "textarea", required: true },
    {
      name: "mood",
      type: "select",
      required: true,
      options: ["melancholic", "hopeful", "romantic", "reflective", "restless"],
      admin: {
        description:
          "Drives the per-poem color treatment (see content/poetry.ts MOOD_STYLES).",
      },
    },
    {
      name: "lines",
      type: "array",
      labels: { singular: "Line", plural: "Lines" },
      fields: [{ name: "text", type: "text", required: true }],
    },
    {
      name: "audio",
      type: "upload",
      relationTo: "media",
      admin: { description: "Voice recording of this poem." },
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "displayOrder", type: "number", defaultValue: 0 },
  ],
};
