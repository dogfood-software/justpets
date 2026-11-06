/** biome-ignore-all assist/source/useSortedKeys: These are intentionally sorted */
import * as t from "drizzle-orm/pg-core";
import { localeEnum } from "./public";
import { defineRelationsPart } from "drizzle-orm/relations";

export const auth = t.pgSchema("auth");

export const user = auth.table("user", {
  id: t.uuid("id").defaultRandom().primaryKey(),
  name: t.text("name").notNull(),
  email: t.text("email").notNull().unique(),
  emailVerified: t.boolean("email_verified").default(false).notNull(),
  image: t.text("image"),

  // twoFactor plugin
  twoFactorEnabled: t.boolean("two_factor_enabled").default(false).notNull(),
  // phoneNumber plugin
  phoneNumber: t.varchar("phone_number", { length: 255 }).unique(),
  phoneNumberVerified: t.boolean("phone_number_verified"),
  // admin plugin
  role: t.text("role"),
  banned: t.boolean("banned"),
  banReason: t.text("ban_reason"),
  banExpires: t.timestamp("ban_expires", { precision: 6, withTimezone: true }),

  // lastLoginMethod plugin
  lastLoginMethod: t.text("last_login_method"),

  // custom field locale, supported locales only
  locale: localeEnum("locale").default("en-US"),

  createdAt: t
    .timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: t
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = auth.table(
  "session",
  {
    id: t.uuid("id").defaultRandom().primaryKey(),
    expiresAt: t.timestamp("expires_at", { withTimezone: true }).notNull(),
    token: t.text("token").notNull().unique(),
    ipAddress: t.text("ip_address"),
    userAgent: t.text("user_agent"),
    userId: t
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // admin plugin
    impersonatedBy: t
      .uuid("impersonated_by")
      .references(() => user.id, { onDelete: "set null" }),

    activeOrganizationId: t
      .uuid("active_organization_id")
      .references(() => organization.id, { onDelete: "set null" }),

    createdAt: t
      .timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [t.index("session_userId_idx").on(table.userId)]
);

export const account = auth.table(
  "account",
  {
    id: t.uuid("id").defaultRandom().primaryKey(),
    accountId: t.text("account_id").notNull(),
    providerId: t.text("provider_id").notNull(),
    userId: t
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: t.text("access_token"),
    refreshToken: t.text("refresh_token"),
    idToken: t.text("id_token"),
    accessTokenExpiresAt: t.timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: t.text("scope"),
    password: t.text("password"),
    createdAt: t
      .timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [t.index("account_userId_idx").on(table.userId)]
);

export const verification = auth.table(
  "verification",
  {
    id: t.uuid("id").defaultRandom().primaryKey(),
    identifier: t.text("identifier").notNull(),
    value: t.text("value").notNull(),
    expiresAt: t.timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: t
      .timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [t.index("verification_identifier_idx").on(table.identifier)]
);

export const jwks = auth.table("jwks", {
  id: t.uuid("id").defaultRandom().primaryKey(),
  publicKey: t.text("public_key").notNull(),
  privateKey: t.text("private_key").notNull(),
  alg: t.text("alg"),
  crv: t.text("crv"),
  createdAt: t.timestamp("created_at", { withTimezone: true }).notNull(),
  expiresAt: t.timestamp("expires_at", { withTimezone: true }),
});

/** Represents a pet care buisness */
export const organization = auth.table("organization", {
  id: t.uuid("id").defaultRandom().primaryKey(),
  name: t.text("name").notNull(),
  slug: t.text("slug").notNull().unique(),
  logo: t.text("logo"),
  createdAt: t.timestamp("created_at", { withTimezone: true }).notNull(),
  metadata: t.text("metadata"),
});

/** Represents a staff member of a petcare buisness ({@link organization}) */
export const member = auth.table(
  "member",
  {
    id: t.uuid("id").defaultRandom().primaryKey(),
    organizationId: t
      .uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: t
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: t.text("role").default("member").notNull(),
    createdAt: t.timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: t
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    t
      .unique("member_organizationId_userId_unique")
      .on(table.organizationId, table.userId),
    t.index("member_organizationId_idx").on(table.organizationId),
    t.index("member_userId_idx").on(table.userId),
  ]
);

export const invitation = auth.table(
  "invitation",
  {
    id: t.uuid("id").defaultRandom().primaryKey(),
    organizationId: t
      .uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: t.text("email").notNull(),
    role: t.text("role"),
    status: t.text("status").default("pending").notNull(),
    expiresAt: t.timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: t
      .timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    inviterId: t
      .uuid("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    t.index("invitation_email_idx").on(table.email),
    t.index("invitation_organizationId_idx").on(table.organizationId),
  ]
);

export const apikey = auth.table(
  "apikey",
  {
    id: t.uuid("id").defaultRandom().primaryKey(),
    configId: t.text("config_id").default("default").notNull(),
    name: t.text("name"),
    start: t.text("start"),
    referenceId: t.text("reference_id").notNull(),
    prefix: t.text("prefix"),
    key: t.text("key").notNull(),
    refillInterval: t.integer("refill_interval"),
    refillAmount: t.integer("refill_amount"),
    lastRefillAt: t.timestamp("last_refill_at"),
    enabled: t.boolean("enabled").default(true),
    rateLimitEnabled: t.boolean("rate_limit_enabled").default(true),
    rateLimitTimeWindow: t
      .integer("rate_limit_time_window")
      .default(86_400_000),
    rateLimitMax: t.integer("rate_limit_max").default(10),
    requestCount: t.integer("request_count").default(0),
    remaining: t.integer("remaining"),
    lastRequest: t.timestamp("last_request"),
    expiresAt: t.timestamp("expires_at"),
    createdAt: t.timestamp("created_at").notNull(),
    updatedAt: t.timestamp("updated_at").notNull(),
    permissions: t.text("permissions"),
    metadata: t.text("metadata"),
  },
  (table) => [
    t.index("apikey_configId_idx").on(table.configId),
    t.index("apikey_referenceId_idx").on(table.referenceId),
    t.index("apikey_key_idx").on(table.key),
  ]
);

export const twoFactor = auth.table(
  "two_factor",
  {
    id: t.text("id").primaryKey(),
    userId: t
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    secret: t.text("secret").notNull(),
    backupCodes: t.text("backup_codes").notNull(),
    verified: t.boolean("verified").notNull(),
    failedVerificationCount: t.integer("failed_verification_count").notNull(),
    lockedUntil: t.timestamp("locked_until", {
      precision: 6,
      withTimezone: true,
    }),
  },
  (table) => [t.index("twoFactor_secret_idx").on(table.secret)]
);

export const passkey = auth.table(
  "passkey",
  {
    id: t.text("id").primaryKey(),
    name: t.text("name"),
    publicKey: t.text("public_key").notNull(),
    userId: t
      .uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    credentialID: t.text("credential_id").notNull(),
    counter: t.integer("counter").notNull(),
    deviceType: t.text("device_type").notNull(),
    backedUp: t.boolean("backed_up").notNull(),
    transports: t.text("transports"),
    createdAt: t.timestamp("created_at", { precision: 6, withTimezone: true }),
    aaguid: t.text("aaguid"),
  },
  (table) => [t.index("passkey_userId_idx").on(table.userId)]
);

export const authRelations = defineRelationsPart({ user, session, account, verification }, (r) => ({
  user: {
    sessions: r.many.session({
      from: r.user.id,
      to: r.session.userId,
    }),
    accounts: r.many.account({
      from: r.user.id,
      to: r.account.userId,
    }),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
}));