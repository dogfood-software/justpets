import { execFileSync } from 'node:child_process'
import { createEnv } from '@t3-oss/env-nextjs'
import { railway } from '@t3-oss/env-nextjs/presets-zod'
import { z } from 'zod'

function getDeploymentId(): string {
  // pull the value directly from Railway during builds if possible
  if (process.env.RAILWAY_GIT_COMMIT_SHA) {
    return process.env.RAILWAY_GIT_COMMIT_SHA
  }

  // fallback to git locally
  try {
    return (
      execFileSync('git', ['describe', '--always', '--dirty', '--exclude', '*'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 1000,
      }).trim() || 'FAILED-VERSION-PROTECTION'
    )
  } catch {
    // We should never get here
    return 'CRASHED-VERSION-PROTECTION'
  }
}

export const env = createEnv({
  // We deploy on Railway for now
  extends: [railway()],
  // Custom Keys
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    // PORT: z.coerce.number().int().min(1).max(65535).default(4041),
    // IDLE_TIMEOUT: z.coerce.number().default(10),
    DEPLOYMENT_ID: z.string().min(1).default(getDeploymentId),
    // Payload Config
    PAYLOAD_SECRET: z.string().min(32),
    MONGO_URL: z.url({ protocol: /^mongodb$/ }),
    // Cache
    REDIS_URL: z.url({ protocol: /^redis$/ }),
    // Files
    S3_ENDPOINT: z.url(),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    S3_REGION: z.string().optional().default('auto'),
    // Auth
    API_SERVER_URL: z.url(),
    APP_SERVER_URL: z.url(),
    // Email
  },
  // pull from process.env, only client variables
  // see https://env.t3.gg/docs/nextjs
  experimental__runtimeEnv: {},
  // Missing stuff is undefined, proper but annoying TS
  emptyStringAsUndefined: true,
  // This is a server and can only be a server
  isServer: true,
  // Allow us to skip e.g. in CI
  skipValidation: !process.env.VALIDATE_ENV,
})
