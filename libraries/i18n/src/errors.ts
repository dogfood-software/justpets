import { z } from "zod";
import type { Locale } from "./locales";

export function setZodLocale(locale: Locale) {
  z.config(getZodLocale(locale));
}

export function getZodLocale(locale: Locale): ReturnType<typeof z.locales.en> {
  // biome-ignore lint/style/useDefaultSwitchClause: we want this to fail when adding a new locale to inform us to add a new case
  switch (locale) {
    case "en-US":
      return z.locales.en();
    case "es-US":
      return z.locales.es();
    case "he-IL":
      return z.locales.he();
  }
}
