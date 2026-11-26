import { match } from '@formatjs/intl-localematcher'
import { Locales, DEFAULT_LOCALE, LOCALE_COOKIE } from '@libraries/i18n'
import type { Locale } from '@libraries/i18n'
import { useCookie } from '@web/ui/hooks/use-cookie'
import { useMemo } from 'react'

function readCookie(name: string): string | undefined {
  // eslint-disable-next-line no-shadow
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`),
  )
  return match?.[1] ? decodeURIComponent(match[1]) : undefined
}

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (Locales as readonly string[]).includes(value)
}

export function useDetectedLocale() {
  const cookie = useCookie(LOCALE_COOKIE)

  const matched = useMemo(
    () => match([...navigator.languages], [...Locales], DEFAULT_LOCALE),
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [navigator.languages.join(',')],
  )

  if (cookie && isLocale(cookie)) {
    return cookie
  }

  return isLocale(matched) ? matched : DEFAULT_LOCALE
}

export function detectLocale(): Locale {
  const fromCookie = readCookie(LOCALE_COOKIE)
  if (isLocale(fromCookie)) {
    return fromCookie
  }

  const matched = match([...navigator.languages], [...Locales], DEFAULT_LOCALE) as Locale

  return isLocale(matched) ? matched : DEFAULT_LOCALE
}

export function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)};path=/;max-age=31536000;SameSite=Lax`
}
