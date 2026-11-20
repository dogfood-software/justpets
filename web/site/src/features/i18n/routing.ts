import { DEFAULT_LOCALE, LOCALE_COOKIE, Locales } from '@libraries/i18n'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // This is done via the sitemap.xml,
  // not all pages are in all locales
  alternateLinks: false,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,

  // customize the cookie name
  localeCookie: {
    name: LOCALE_COOKIE,
  },

  // https://next-intl.dev/docs/routing/configuration#pathnames
  // We want to use locale specific paths sometimes
  // pathnames: {
  // "/login": {
  //   "es-US": "/acceso",
  // }
  // },

  // use cookie and accept-language header to detect the locale for unknown requests
  localeDetection: true,

  // We always want to show the locale in the URL
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      'en-US': '/en',
      'es-US': '/es',
      'he-IL': '/he',
    },
    // prefixes: {
    //   "ar-AE": "ar",
    //   "bg-BG": "bg",
    //   "cs-CZ": "cs",
    //   "da-DK": "da",
    //   "de-DE": "de",
    //   "el-GR": "el",
    //   "en-GB": "en/gb",
    //   "en-US": "en",
    //   "es-ES": "es",
    //   "et-EE": "et",
    //   "fi-FI": "fi",
    //   "fr-CA": "fr/ca",
    //   "fr-FR": "fr",
    //   "he-IL": "he",
    //   "hr-HR": "hr",
    //   "hu-HU": "hu",
    //   "it-IT": "it",
    //   "ja-JP": "ja",
    //   "ko-KR": "ko",
    //   "lt-LT": "lt",
    //   "lv-LV": "lv",
    //   "nb-NO": "nb",
    //   "nl-NL": "nl",
    //   "pl-PL": "pl",
    //   "pt-BR": "pt/br",
    //   "pt-PT": "pt",
    //   "ro-RO": "ro",
    //   "ru-RU": "ru",
    //   "sk-SK": "sk",
    //   "sl-SI": "sl",
    //   "sv-SE": "sv",
    //   "tr-TR": "tr",
    //   "uk-UA": "uk",
    //   "zh-CN": "zh/cn",
    //   "zh-TW": "zh/tw",
    // },
  },
  // A list of all locales that are supported
  locales: Locales,
})
