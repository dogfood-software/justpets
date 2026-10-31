import { describe, expect, test } from "vitest";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
  Locales,
  nativeName,
} from "./locales";

describe("locales", () => {
  // ensure that the names remain as expected
  describe("nativeName", () => {
    test.each([
      // ["de-DE", "Deutsch"],
      ["en-US", "English"], // (United States)
      ["es-US", "Español"], // (Estados Unidos)
      // ["es-ES", "Español"],
      // ["fr-FR", "Français"],
      ["he-IL", "עברית"],
      // ["it-IT", "Italiano"],
      // ["nl-NL", "Nederlands"],
    ] as const)("converts %s to %s", (locale, name) => {
      expect(nativeName(locale)).toBe(name);
    });
  });

  test("Locales lists every supported locale tag", () => {
    expect(Locales).toEqual(["en-US", "es-US", "he-IL"]);
  });

  test("every Locales entry has a native name", () => {
    for (const locale of Locales) {
      expect(nativeName(locale as Locale).length).toBeGreaterThan(0);
    }
  });

  test("DEFAULT_LOCALE is en-US and included in Locales", () => {
    expect(DEFAULT_LOCALE).toBe("en-US");
    expect(Locales).toContain(DEFAULT_LOCALE);
  });

  test("LOCALE_COOKIE is locale", () => {
    expect(LOCALE_COOKIE).toBe("locale");
  });
});
