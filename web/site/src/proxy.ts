// import { postHogMiddleware } from "@posthog/next";
import type { NextFetchEvent, NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/features/i18n/routing'

const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest, _next: NextFetchEvent) {
  const response = await intlMiddleware(request)
  // return postHogMiddleware({
  //   apiKey: ENV.POSTHOG_PROJECT_TOKEN,
  //   proxy: false,
  //   response,
  // })(request);
  return response
}

export const config = {
  // Matcher ignoring `/_next/`,
  // You may need to adjust it to ignore static assets in `/public` folder
  matcher: [
    // ignore `/_next`, `_vercel`, `_betterstack` and any paths with a `.` in them
    '/((?!(?:app|payload)(?:/|$)|_next|_vercel|_betterstack|payload|.*\\..*).*)',

    // include docs paths with a . in them such as docs/og/image.png or docs/llms.txt
    // "/([\\w-]+)?/docs/(.+)",

    // Include paths with a `.` followed by `/` (e.g. /.env/bla), so they hit the
    // proxy — same idea as including docs paths with a `.` such as docs/og/image.png.
    // Carve out `.well-known` (and add other expected special `.` paths here).
    '/((?!\\.well-known)\\.[^/]+/.*)',
  ],
}
