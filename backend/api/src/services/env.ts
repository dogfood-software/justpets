import { execFileSync } from "node:child_process";
import { createEnv } from "@t3-oss/env-core";
import { railway } from "@t3-oss/env-core/presets-zod"
import { z } from "zod";

function getDeploymentId(): string {
  try {
    return execFileSync("git", ["describe", "--always", "--dirty", "--exclude", "*"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 1000,
    }).trim() || "dev-unknown";
  } catch {
    // Production images may have neither Git nor repository history.
    return "dev-unknown";
  }
}

export const env = createEnv({
  // We deploy on Railway for now
  extends: [railway()],
  // Custom Keys
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(4041),
    IDLE_TIMEOUT: z.coerce.number().default(10),
    DEPLOYMENT_ID: z.string().min(1).default(getDeploymentId),
    // Better Auth Config
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url().default("https://justpets.localhost"),
    OAUTH_PROXY_SECRET: z.string().min(1),
    // SSO Providers
    APPLE_CLIENT_ID: z.string().min(1).default("app.justpets.service-id"),
    APPLE_TEAM_ID: z.string().min(1),
    APPLE_KEY_ID: z.string().min(1),
    APPLE_PRIVATE_KEY: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    FACEBOOK_CLIENT_ID: z.string().min(1),
    FACEBOOK_CLIENT_SECRET: z.string().min(1),
    // TODO: Add Reddit and X/Twitter

    // Core Data
    DATABASE_URL: z.url({ protocol: /^postgres(?:ql)?$/ }),
    // Cache
    REDIS_URL: z.url({ protocol: /^redis$/ }),
    // Files
    S3_ENDPOINT: z.url(),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    // Email
    RESEND_API_KEY: z.string().min(1).optional(),
  },
  // pull from Process.env
  runtimeEnv: process.env,
  // Missing stuff is undefined, proper but annoying TS
  emptyStringAsUndefined: true,
  // This is a server and can only be a server
  isServer: true,
  // Allow us to skip e.g. in CI
  skipValidation: !!process.env.SKIP_VALIDATE_ENV,
});
