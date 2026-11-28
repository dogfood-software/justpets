import { env } from '@/env'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import createNextIntlPlugin from 'next-intl/plugin'

// import { createRequire } from "node:module";
// import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

// const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/features/i18n/request.ts',
  experimental: {
    createMessagesDeclaration: './src/features/i18n/messages/en-US.json',
  },
})

const nextConfig = (_phase: string): NextConfig => ({
  // Deployed to docker
  output: 'standalone',
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],

  // Stream in just the parts that are dynamic
  cacheComponents: true,
  // Faster page navigations for users
  // https://nextjs.org/blog/next-16-3-instant-navigations
  partialPrefetching: true,

  // Compression handled here to avoid proxy buffering
  compress: true,

  // just don't send cookies when we don't have to
  crossOrigin: 'anonymous',

  // Handle the monorepo during builds
  outputFileTracingRoot: path.join(dirname, '../..'),

  // Don't tell the world our tech stack
  poweredByHeader: false,

  // Improve performance for dynamic pages
  reactCompiler: true,

  // Follow best practices
  reactStrictMode: true,

  // Type check our routing, TS 7 makes this fast enough
  typedRoutes: true,

  // version-skew protection
  // https://nextjs.org/docs/app/guides/self-hosting#version-skew
  deploymentId: process.env.DEPLOYMENT_ID,

  experimental: {
    // forbidden (403), unautorized (401)...
    authInterrupts: true,
    // Unmatched URLs render `global-not-found` with a real HTTP 404
    globalNotFound: true,
    // Server actions (if we use them at all, are proxied)
    serverActions: { allowedOrigins: ['justpets.app', 'justpets.localhost'] },
    // avoid babel, just no babel please
    turbopackRustReactCompiler: true,
    // Typed env, replaced with env.ts for now
    // typedEnv: true,
  },

  images: {
    // localPatterns: [
    //   {
    //     pathname: '/api/media/file/**',
    //   },
    // ],
  },
  turbopack: {
    root: path.resolve(dirname, '../../'),
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
})

// eslint-disable-next-line import/no-anonymous-default-export
export default (phase: string) =>
  withPayload(withNextIntl(nextConfig(phase)), { devBundleServerPackages: false })
