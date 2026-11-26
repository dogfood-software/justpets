import type { Locale } from '@libraries/i18n'
import type { Messages } from 'use-intl'

import { IntlProvider } from 'use-intl'
import { useCurrentTimezone } from '../hooks/use-timezone'
import { dir } from '@libraries/i18n'
import { use, useEffect } from 'react'

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const timezone = useCurrentTimezone()
  const messages = use(loadMessages(locale))

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir(locale)
  }, [locale])

  return (
    <IntlProvider locale={locale} timeZone={timezone} messages={messages}>
      {children}
    </IntlProvider>
  )
}

const modules = import.meta.glob<{ default: Messages }>('../messages/*.json')

// cache the messages promises to avoid re-loading and showing a flicker
// We do it this way to only block initial render on the users intended locale
const messagesCache = new Map<Locale, Promise<Messages>>()

function loadMessages(locale: Locale) {
  let promise = messagesCache.get(locale)
  if (!promise) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    promise = modules[`../messages/${locale}.json`]?.().then((m) => m.default)
    messagesCache.set(locale, promise)
  }
  return promise
}
