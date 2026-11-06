import { log } from "evlog";
// Core
import type { Logger } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal"; // don't bother with Keysley
// Plugins
import { apiKey } from "@better-auth/api-key";
import { expo } from "@better-auth/expo";
import { i18n, locales, type TranslationDictionary } from "@better-auth/i18n";
import { passkey } from "@better-auth/passkey";
import {
  // type DefaultOrganizationPlugin,
  admin,
  // emailOTP,
  jwt,
  lastLoginMethod,
  oAuthProxy,
  openAPI,
  organization,
} from "better-auth/plugins";
// Internal
import { LOCALE_COOKIE, type Locale } from "@libraries/i18n";
import type { Database } from "@backend/db";
import * as schema from "@backend/db/schema/auth";
import { env } from "@backend/api/services/env"
import { additionalFields } from "./additional-fields";
// import { generateAppleClientSecret } from "./lib/apple";
import { he } from "../translations/he";
import { bunRedisStorage } from "./secondary-storage";
import { redis } from "@backend/api/services/redis";
import { generateAppleClientSecret } from "./apple";

const logger: Logger = {
  level: "warn",
  log: (level, message, ...args) => {
    log[level]({ args, message });
  },
};

const translations = {
  "en-US": locales.en,
  "es-US": locales.es,
  "he-IL": he,
} satisfies Record<Locale, TranslationDictionary>;

// Keep plugin types as references to their factories in generated declarations.
// Inferring the array expands every plugin's endpoints into the options type.
// type AuthPlugins = [
//   ReturnType<typeof passkey>,
//   ReturnType<typeof admin>,
//   DefaultOrganizationPlugin<{}>,
//   ReturnType<typeof apiKey>,
//   ReturnType<typeof oAuthProxy>,
//   ReturnType<typeof jwt>,
//   ReturnType<typeof lastLoginMethod>,
//   ReturnType<typeof expo>,
//   ReturnType<typeof i18n>,
//   ReturnType<typeof openAPI>,
// ];

export function createAuth(db: Database) {
  return betterAuth({
    // Deployed URL, used for things like callbacks
    baseURL: env.BETTER_AUTH_URL,
    // Secret used for signing cookies
    secret: env.BETTER_AUTH_SECRET,

    // OTEL logging (evlog)
    logger,
    // And OTEL Traces
    experimental: {
      instrumentation: { enabled: true }
    },

    // We store users in Postgres / NeonDB
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),

    // In Production our Redis instance is much closer as its deployed in Railway
    // We use it for session lookups and rate limits
    secondaryStorage: bunRedisStorage({ client: redis }),

    account: {
      accountLinking: {
        // Apple Hidden emails will require this to link accounts
        allowDifferentEmails: true,
        // users can always sign in with an email OTP
        allowUnlinkingAll: true,
        // users can sign in with multiple options
        enabled: true,
        // We trust these providers
        trustedProviders: ["apple", "google", "facebook", "discord"],
        // Linking an account does not auto-update their information
        updateUserInfoOnLink: false,
      },
    },

    advanced: {
      database: {
        // we use UUID identifiers... Makes joins simpler in the data model
        generateId: "uuid",
      },
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
      },
    },
    
    databaseHooks: {
      user: {
        create: {
          // Image is already on the user — sync domain check, download in background.
          after: (_user) => {
            // profileImages?.cacheExternalImage(user.id, user.image);
            return Promise.resolve();
          },
        },
      },
      session: {
        create: {
          // Sign-in / returning users: load image in background (does not block).
          after: (_session) => {
            // profileImages?.cacheExternalImage(session.userId);
            return Promise.resolve();
          },
        },
      },
    },

    // https://www.404media.co/we-dont-want-your-password-3/
    // Rather than magic links we use OTPs, this resolves the issue of "magic link auto-opened in the wrong place"
    // We also NEVER WANT TO STORE PASSWORDS. They are a pain and help hackers more than users.
    emailAndPassword: { enabled: false },

    session: {
      cookieCache: {
        enabled: false, // consider true if we have load higher than our redis instance can handle
        version: "1", // Change to invalidate existing cookie caches and reload from the database
      },
      // Store all sessions in the database as an audit log
      storeSessionInDatabase: true,
      preserveSessionInDatabase: true,
      // 30 day login that refreshes daily
      expiresIn: 60 * 60 * 24 * 30, // Staff should use it daily, this 30 days is mostly for parents.
      updateAge: 60 * 60 * 24 * 1, // Keep the session alive every day they sign in
    },
    socialProviders: {
      // // required on iOS. Also in line with our goal of "sign in with your device"
      apple: async () => ({
        // appBundleIdentifier: env.APPLE_BUNDLE_IDENTIFIER,
        clientId: env.APPLE_CLIENT_ID,
        appBundleIdentifier: "software.dogfood.justpets",
        audience: [
          "software.dogfood.justpets",
          "software.dogfood.justpets-business",
          "software.dogfood.justpets-travel",
        ],
        clientSecret: await generateAppleClientSecret({
          clientId: env.APPLE_CLIENT_ID,
          keyId: env.APPLE_KEY_ID,
          teamId: env.APPLE_TEAM_ID,
          privateKey: env.APPLE_PRIVATE_KEY,
        }),
      }),
      // // Android — refresh Google avatar URL on each sign-in so we can re-cache.
      google: {
        // prompt: "select_account", // Lets make sure they are always sure or can switch accounts
        clientId: [env.GOOGLE_CLIENT_ID], // TODO: add ios/android client ids,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        // Prevent potential google signup spam
        requireEmailVerification: true,
      },
      // Facebook - When we advertize to pet parents on forums there should be a 1 click sign in
      facebook: {
        clientId: env.FACEBOOK_CLIENT_ID,
        clientSecret: env.FACEBOOK_CLIENT_SECRET,
      }
    },

    // Allowed origins for mobile apps and web apps
    trustedOrigins: [
      "justpets-parent://", // parent app schema
      "justpets-buisness://", // buisness app schema
      "justpets-travel://", // travel parent app schema
      ...(process.env.NODE_ENV === "development" // mobile app schemas in development
        ? [
            "http://justpets.localhost",
            "exp://",
            "exp://**",
            "exp://192.168.*.*:*/**",
          ]
        : []),
    ],

    // We need to track the users timezone and preferred language to show them the correct information
    // These are the only additional fields we want to store about a user.
    // https://www.better-auth.com/docs/concepts/database#extending-core-schema
    user: { additionalFields },

    // all plugins
    plugins: [
      // Default Authentication Method. See https://www.404media.co/we-dont-want-your-password-3/
      // emailOTP({
        // changeEmail: { enabled: true, verifyCurrentEmail: true },
        // TODO: Send it in the users or the current locale
        // sendVerificationOTP: (data) => mail.sendVerificationOTP(data),
      // }),
      // Power users who use Password Managers. One click sign in for them.
      passkey(),
      // Internal user administration, mostly for impersonation during support incidents
      admin(),
      // Organizations are the core of our product. As we sell to Businesses.
      organization({
        // async sendInvitationEmail(data) {
        //   try {
        //     await mail.sendOrganizationInvitation({
        //       ...data,
        //       // not getting types from `additionalFields` for some reason
        //       locale: (data.inviter.user as unknown as { locale: Locale })
        //         .locale,
        //       // TODO: make this link work
        //       url: `${env.BETTER_AUTH_URL}/api/accept-invitation/${data.id}`,
        //     });
        //     logger?.log?.("info", "invitation email sent", { data });
        //   } catch (error) {
        //     logger?.log?.("error", "failed to send invitation email", {
        //       data,
        //       error,
        //     });
        //     throw error;
        //   }
        // },
      }),

      // For power users/developers
      apiKey(),

      // OAuth Proxy so that we can use our OAuth apps in any environment
      oAuthProxy({
        productionURL: "https://alpha.justpets.app",
        secret: env.OAUTH_PROXY_SECRET,
      }),

      // JWTs are required for PowerSync and potentially other sidecar services
      jwt({
        jwks: {
          keyPairConfig: { alg: "ES256" },
        },
        // Powersync uses `/token` directly and not the header
        disableSettingJwtHeader: true,
      }),

      // Nice convenience for users, also analytics for us to know what methods are used most
      lastLoginMethod({ storeInDatabase: true }),

      // Mobile App Support
      expo(),

      // support our locales
      i18n({
        detection: ["session", "cookie", "header"],
        localeCookie: LOCALE_COOKIE,
        translations,
      }),

      // Documentation for developers building against our platform.
      openAPI({
        disableDefaultReference: true, // we have our own docs UI
      }),
    ],
  });
}
