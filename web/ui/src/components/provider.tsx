"use client";

import { I18nProvider, Toast } from "@heroui/react";
import { type Locale, setZodLocale } from "@libraries/i18n";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

export { RouterProvider } from "@heroui/react";

export type UITheme = "light" | "dark" | "system";

export function UIProviders({
  children,
  locale,
  theme = "system",
}: {
  children: React.ReactNode;
  locale: Locale;
  theme?: UITheme;
}) {
  const forcedTheme = theme === "system" ? undefined : theme;
  useEffect(() => setZodLocale(locale), [locale]);

  return (
    <I18nProvider locale={locale}>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme={theme}
        enableColorScheme
        enableSystem={theme === "system"}
        forcedTheme={forcedTheme}
        // prevent issues in NextJS 16+ when page is static.
        scriptProps={typeof window === "undefined" ? { type: "application/json" } : undefined}
      >
        {children}
        <Toast.Provider placement="top" />
      </ThemeProvider>
    </I18nProvider>
  );
}
