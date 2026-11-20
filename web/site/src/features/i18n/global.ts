import type { Formats } from '@libraries/i18n'
import type { routing } from '@/features/i18n/routing'
import type messages from './messages/en-US.json'

declare module 'next-intl' {
  interface AppConfig {
    Formats: Formats
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
