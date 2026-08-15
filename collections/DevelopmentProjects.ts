import type { CollectionConfig } from "payload";
import { authenticated } from "../access/authenticated";

/** Mirrors content/development.ts's DevelopmentProject shape. */
export const DevelopmentProjects: CollectionConfig = {
  slug: "development-projects",
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "_status", "displayOrder"],
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: ["Web", "Business"],
    },
    { name: "shortDescription", type: "textarea", required: true },
    { name: "fullDescription", type: "richText" },
    { name: "role", type: "text", required: true },
    {
      name: "technologies",
      type: "array",
      labels: { singular: "Technology", plural: "Technologies" },
      fields: [{ name: "value", type: "text", required: true }],
    },
    { name: "externalUrl", type: "text" },
    { name: "githubUrl", type: "text" },
    { name: "businessContext", type: "textarea" },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "displayOrder", type: "number", defaultValue: 0 },
  ],
};
