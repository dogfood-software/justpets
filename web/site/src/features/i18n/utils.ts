import { LOCALE_COOKIE, type Locale } from '@libraries/i18n'
import { cookies, headers } from 'next/headers'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

function localeFromPathname(pathname: string): Locale | undefined {
  const firstSegment = pathname.split('/').find(Boolean)
  return hasLocale(routing.locales, firstSegment) ? firstSegment : undefined
}

/**
 * Locale for unmatched URLs. `global-not-found` has no `[locale]` segment, so
 * `getLocale()` falls back to the default at prerender time.
 */
export async function getRequestLocaleWithoutSegment(): Promise<Locale> {
  const headerStore = await headers()
  const fromIntl =
    headerStore.get('x-next-intl-locale') ??
    headerStore.get('x-middleware-request-x-next-intl-locale')
  if (hasLocale(routing.locales, fromIntl)) {
    return fromIntl
  }

  const rewrite = headerStore.get('x-middleware-rewrite')
  if (rewrite) {
    try {
      const fromRewrite = localeFromPathname(new URL(rewrite, 'http://localhost').pathname)
      if (fromRewrite) {
        return fromRewrite
      }
    } catch {
      // Ignore malformed rewrite URLs and keep falling through.
    }
  }

  const fromNextUrl = headerStore.get('next-url')
  if (fromNextUrl) {
    const fromPath = localeFromPathname(fromNextUrl)
    if (fromPath) {
      return fromPath
    }
  }

  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value
  if (hasLocale(routing.locales, fromCookie)) {
    return fromCookie
  }

  return routing.defaultLocale
}
