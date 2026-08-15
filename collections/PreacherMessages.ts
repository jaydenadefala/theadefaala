import type { CollectionConfig } from "payload";
import { authenticated } from "../access/authenticated";

/** Mirrors content/preacher.ts's PreacherMessage shape. */
export const PreacherMessages: CollectionConfig = {
  slug: "preacher-messages",
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
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
    { name: "excerpt", type: "textarea", required: true },
    { name: "body", type: "richText" },
    { name: "scripture", type: "text" },
    { name: "category", type: "text", required: true, defaultValue: "Message" },
    { name: "date", type: "date" },
    {
      name: "audio",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "videoUrl",
      type: "text",
      admin: { description: "External video URL (e.g. YouTube), if any." },
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "displayOrder", type: "number", defaultValue: 0 },
  ],
};
