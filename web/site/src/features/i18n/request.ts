import { formats } from '@libraries/i18n'
import * as rootParams from 'next/root-params'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ locale }) => {
  // Typically corresponds to the `[locale]` segment
  if (!locale) {
    const paramValue = await rootParams?.locale?.()
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue
    }
  }

  locale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale

  // merge UI and public messages
  const messages = {
    ...(await import(`./messages/${locale}.json`)).default,
    // ...(await import(`@web/ui/i18n/messages/${locale}`)).default,
  }

  return {
    formats,
    locale,
    messages,
    // Default timezone to display when server rendering,
    // we use the companyies home state
    timeZone: 'America/New_York',
  }
})
