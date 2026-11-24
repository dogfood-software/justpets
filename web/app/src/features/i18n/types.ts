import type { Locale } from '@libraries/i18n'
// import type UIMessages from "@platform/ui/i18n/messages/en-US";
import type WebMessages from './messages/en-US.json'

type Messages = typeof WebMessages // & typeof UIMessages;

declare module 'use-intl' {
  interface AppConfig {
    Locale: Locale
    Messages: Messages
  }
}

export type { Messages }
