import { DEFAULT_LOCALE, type Locale, Locales } from '@libraries/i18n'

/** Resolve Storybook toolbar locale for story render / play. */
export function storyLocale(globals: { locale?: Locale | string }): Locale {
  return Locales.includes(globals.locale as Locale) ? (globals.locale as Locale) : DEFAULT_LOCALE
}
