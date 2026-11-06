import { createAuth } from "@backend/api/modules/auth/lib/better-auth";
import { db } from "./db";

export const auth = createAuth(db);

export type Session = typeof auth["$Infer"]["Session"];
export type Organization = typeof auth["$Infer"]["Organization"];
export type ActiveOrganization = typeof auth["$Infer"]["ActiveOrganization"];
export type Member = typeof auth["$Infer"]["Member"];
export type Auth = typeof auth;
