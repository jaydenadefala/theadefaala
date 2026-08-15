import type { Access } from "payload";

/**
 * Payload defaults an operation to fully open when no access rule is
 * given for it — a real, currently-exploitable gap I found while
 * wiring the frontend: every content collection had explicit read
 * access but nothing restricting create/update/delete, meaning anyone
 * could POST/PATCH/DELETE against the public REST API with no auth at
 * all. Every collection's create/update/delete now uses this.
 */
export const authenticated: Access = ({ req: { user } }) => Boolean(user);
