import { z } from 'zod'
import type { Locale } from './locales'

export function setZodLocale(locale: Locale) {
  z.config(getZodLocale(locale))
}

export function getZodLocale(locale: Locale): ReturnType<typeof z.locales.en> {
  // Keep this exhaustive so TypeScript reports missing cases when adding a locale.
  switch (locale) {
    case 'en-US':
      return z.locales.en()
    case 'es-US':
      return z.locales.es()
    case 'he-IL':
      return z.locales.he()
  }
}
