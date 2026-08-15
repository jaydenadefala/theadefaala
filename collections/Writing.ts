import type { CollectionConfig } from "payload";

/**
 * Mirrors content/writing.ts's WritingPiece shape. Payload's native
 * draft/publish versioning replaces the hand-rolled status field —
 * the adapter layer (Milestone 11) maps _status back to the existing
 * "draft" | "published" domain type so components never see the
 * difference.
 */
export const Writing: CollectionConfig = {
  slug: "writing",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "_status", "displayOrder"],
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "subtitle", type: "text" },
    { name: "excerpt", type: "textarea", required: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: ["Essay", "Reflection", "Poem"],
    },
    {
      name: "accent",
      type: "text",
      required: true,
      defaultValue: "#c9a24b",
      admin: { description: "Hex color for the gallery card cover." },
    },
    { name: "body", type: "richText" },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "displayOrder", type: "number", defaultValue: 0 },
  ],
};
