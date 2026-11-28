import { Locales, nativeName, dir } from '@libraries/i18n'

import { s3Storage } from '@payloadcms/storage-s3'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sharpTransformer } from '@payloadcms/transformer-sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from '@/features/content/collections/users'
import { Media } from '@/features/content/collections/media'
import { Folders } from '@/features/content/collections/folders'
import { Tags } from '@/features/content/collections/tags'
import { env } from './env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: '/payload/admin',
    api: '/payload/api',
    // graphQL: "/payload/api/graphql",
    // graphQLPlayground: "/payload/api/graphql-playground"
  },
  graphQL: { disable: true },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app/payload/admin/importMap.js'),
    },
    components: {
      beforeLogin: ['./features/content/components/before-login#BeforeLogin'],
    },
  },
  collections: [Users, Media, Folders, Tags],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'features/content/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: env.MONGO_URL || '',
  }),
  localization: {
    locales: Locales.map((l) => ({ code: l, label: nativeName(l), dir: dir(l) })),
    fallback: true,
    defaultLocale: 'en-US',
  },
  plugins: [mcpPlugin({})],
  upload: {
    transformers: [sharpTransformer()],
  },
  storage: [
    s3Storage({
      collections: {
        media: {
          signedDownloads: true,
          prefix: 'cms/media',
        },
      },
      bucket: env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT,
      },
    }),
  ],
})
