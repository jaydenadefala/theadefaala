import type { GlobalConfig } from "payload";
import { authenticated } from "../access/authenticated";

/**
 * Homepage-level content that isn't a chapter's own editorial copy —
 * the identity labels (Developer/Writer/Poet/Preacher), the closing
 * CTA, and the copyright line. Deliberately does NOT include each
 * chapter's headline/kicker/teaser text: those are fixed brand voice
 * (see the WritingChapter/PoetryChapter/etc. components), not content
 * with a natural CMS field. This global covers what's genuinely
 * data-shaped instead.
 */
export const HomepageSettings: GlobalConfig = {
  slug: "homepage-settings",
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: "identityRoles",
      type: "array",
      labels: { singular: "Role", plural: "Roles" },
      minRows: 1,
      fields: [{ name: "label", type: "text", required: true }],
      defaultValue: [
        { label: "Developer" },
        { label: "Writer" },
        { label: "Poet" },
        { label: "Preacher" },
      ],
    },
    {
      name: "ctaHeadline",
      type: "text",
      required: true,
      defaultValue: "If any of this resonated, let's talk.",
    },
    { name: "ctaButtonText", type: "text", required: true, defaultValue: "Say hello" },
    {
      name: "ctaSecondaryText",
      type: "text",
      required: true,
      defaultValue: "or email directly",
    },
    { name: "copyrightName", type: "text", required: true, defaultValue: "theAdefala" },
  ],
};
