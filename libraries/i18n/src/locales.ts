/** Locales supported by React Aria Components */
/** biome-ignore-all assist/source/useSortedKeys: sorted intentionally by market */
const SUPPORTED_LOCALES = {
  // USA
  "en-US": "English", // "English (United States)",
  "es-US": "Español", // "Español (Estados Unidos)",

  // Canada
  // "en-CA": "English (Canada)",
  // "fr-CA": "Français (Canada)",

  // Nechama and RTL semantic HTML validation
  "he-IL": "עברית", // Hebrew

  // "nl-NL": "Nederlands", // Dutch
  // "fr-FR": "Français", // French (France)
  // "it-IT": "Italiano", // Italian
  // "es-ES": "Español", // Spanish
  // "de-DE": "Deutsch", // German

  // "ar-AE": "العربية", // Arabic (United Arab Emirates)
  // "bg-BG": "Български", // Bulgarian
  // "cs-CZ": "Čeština", // Czech
  // "da-DK": "Dansk", // Danish

  // "el-GR": "Ελληνικά", // Greek

  // "en-GB": "English (UK)", // English (United Kingdom)

  // "et-EE": "Eesti", // Estonian
  // "fi-FI": "Suomi", // Finnish
  // "fr-CA": "Français (Canada)", // French (Canada)

  // "hr-HR": "Hrvatski", // Croatian
  // "hu-HU": "Magyar", // Hungarian

  // "ja-JP": "日本語", // Japanese
  // "ko-KR": "한국어", // Korean
  // "lt-LT": "Lietuvių", // Lithuanian
  // "lv-LV": "Latviešu", // Latvian
  // "nb-NO": "Norsk bokmål", // Norwegian (Bokmål)

  // "pl-PL": "Polski", // Polish
  // "pt-BR": "Português (Brasil)", // Portuguese (Brazil)
  // "pt-PT": "Português (Portugal)", // Portuguese (Portugal)
  // "ro-RO": "Română", // Romanian
  // "ru-RU": "Русский", // Russian
  // "sk-SK": "Slovenčina", // Slovak
  // "sl-SI": "Slovenščina", // Slovenian
  // "sr-SP": "Српски", // Serbian (Serbia)
  // "sv-SE": "Svenska", // Swedish
  // "tr-TR": "Türkçe", // Turkish
  // "uk-UA": "Українська", // Ukrainian
  // "zh-CN": "简体中文", // Simplified Chinese
  // "zh-TW": "繁體中文", // Traditional Chinese
} as const;

export const Locales = Object.keys(
  SUPPORTED_LOCALES
) as (keyof typeof SUPPORTED_LOCALES)[];
export type Locale = (typeof Locales)[number];

export function nativeName(locale: Locale): string {
  return SUPPORTED_LOCALES[locale];
}

export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "en-US";
