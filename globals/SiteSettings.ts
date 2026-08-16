import type { GlobalConfig } from "payload";
import { authenticated } from "../access/authenticated";

/**
 * Site-wide identity — the "Site" section of the master directive's
 * admin spec (title, description, social links, email, profile image,
 * favicon, SEO defaults). A Payload global, not a collection: there's
 * exactly one of these, not a list of them.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    { name: "siteTitle", type: "text", required: true, defaultValue: "theAdefala" },
    {
      name: "siteDescription",
      type: "textarea",
      required: true,
      defaultValue:
        "The personal universe of theAdefala: developer, writer, poet, and preacher.",
    },
    { name: "email", type: "email", required: true, defaultValue: "jaydenadefala@gmail.com" },
    { name: "profileImage", type: "upload", relationTo: "media" },
    {
      name: "socialLinks",
      type: "array",
      labels: { singular: "Social link", plural: "Social links" },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
  ],
};
