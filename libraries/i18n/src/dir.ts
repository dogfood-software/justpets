/**
 * Determines if a locale is read right to left using [Intl.Locale]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale}.
 */
export function dir(localeString: string | null | undefined) {
  if (typeof localeString !== "string" || localeString.length === 0) {
    return "ltr";
  }

  // If the Intl.Locale API is available, use it to get the locale's text direction.
  try {
    const locale = new Intl.Locale(localeString).maximize();

    // Baseline 2026 and NodeJS 24+ is a function
    // Firefox in 2025 and NodeJS 18-24 use textInfo
    const textInfo =
      // @ts-expect-error: getTextInfo is not yet in the TypeScript types.
      typeof locale.getTextInfo === "function" ? locale.getTextInfo() : locale.textInfo;

    return textInfo.direction === "rtl" ? "rtl" : "ltr";
  } catch {
    // if we have an error we explicitly fallback to ltr
    console.error("unable to determine locale")
    return "ltr"
  }
}