import type { CollectionConfig } from "payload";

/**
 * Single-owner auth — this is a personal site's admin, not a
 * multi-tenant system. No roles/permissions layer needed.
 */
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [],
};
