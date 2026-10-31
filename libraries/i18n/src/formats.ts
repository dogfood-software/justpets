import type { Formats as IntlFormats } from "use-intl";

export const formats = {
  dateTime: {
    short: {
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      month: "short",
      year: "numeric",
    },
  },
} satisfies IntlFormats;

export type Formats = typeof formats;
