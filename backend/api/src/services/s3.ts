import { env } from "./env"

// S3 Client with Varlock loaded ENV variables
export const s3 = new globalThis.Bun.S3Client({
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  endpoint: env.S3_ENDPOINT,
  bucket: env.S3_BUCKET,
})