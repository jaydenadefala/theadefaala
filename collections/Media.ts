import type { CollectionConfig } from "payload";
import { authenticated } from "../access/authenticated";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    // Alt text over a raw filename/id — the thing that actually
    // identifies an image when you're picking one for a coverImage
    // field elsewhere in the admin.
    useAsTitle: "alt",
    defaultColumns: ["alt", "filename", "filesize", "updatedAt"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Also used as the image's alt text on the public site.",
      },
    },
  ],
  upload: {
    staticDir: "media",
    // A real thumbnail rendition — without this, Payload's admin list/
    // picker either has no thumbnail or falls back to serving the
    // full-size original as the preview image, which is wasteful for
    // a media library you're browsing/searching, not viewing full-res.
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
    ],
  },
};
