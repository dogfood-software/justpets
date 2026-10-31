import { afterEach, describe, expect, test } from "vitest";
import { z } from "zod";
import { getZodLocale, setZodLocale } from "./errors";
import type { Locale } from "./locales";

describe("errors", () => {
  afterEach(() => {
    z.config(z.locales.en());
  });

  describe("getZodLocale", () => {
    test.each([
      ["en-US", z.locales.en],
      ["es-US", z.locales.es],
      ["he-IL", z.locales.he],
    ] as const)(
      "maps %s to the matching Zod locale messages",
      (locale, zodLocale) => {
        z.config(getZodLocale(locale));
        const viaHelper = z.string().safeParse(123);

        z.config(zodLocale());
        const viaZod = z.string().safeParse(123);

        expect(viaHelper.success).toBe(false);
        expect(viaZod.success).toBe(false);
        if (!(viaHelper.success || viaZod.success)) {
          expect(viaHelper.error.issues[0]?.message).toBe(
            viaZod.error.issues[0]?.message
          );
        }
      }
    );
  });

  describe("setZodLocale", () => {
    test.each([
      ["en-US", "Invalid input: expected string, received number"],
      ["es-US", "Entrada inválida: se esperaba texto, recibido número"],
      ["he-IL", "קלט לא תקין: צריך להיות מחרוזת, התקבל מספר"],
    ] as const)("configures Zod error messages for %s", (locale, message) => {
      setZodLocale(locale satisfies Locale);
      const result = z.string().safeParse(123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(message);
      }
    });
  });
});
