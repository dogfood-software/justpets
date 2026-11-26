import { DEFAULT_LOCALE, dir, type Locale, Locales, nativeName } from '@libraries/i18n'

import type { Decorator, Preview } from '@storybook/react-vite'
import { type ComponentType, useLayoutEffect } from 'react'

import { UIProviders, type UITheme } from '../src/components/provider'

import { preferredJustPetsTheme } from './theme'

import '../src/globals.css'

const LOCALE_FLAGS: Record<Locale, string> = {
  'en-US': '🇺🇸',
  'es-US': '🇺🇸',
  'he-IL': '🇮🇱',
}

function PreviewProviders({
  Story,
  locale,
  theme,
}: {
  Story: ComponentType
  locale: Locale
  theme: UITheme
}) {
  const textDir = dir(locale)

  useLayoutEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = textDir
    document.body.style.background = 'var(--background)'
  }, [locale, textDir])

  return (
    <UIProviders key={`${locale}-${theme}`} locale={locale} theme={theme}>
      <Story />
    </UIProviders>
  )
}

const withUIProviders: Decorator = (Story, context) => {
  const locale = (context.globals.locale as Locale | undefined) ?? DEFAULT_LOCALE
  const theme = (context.globals.theme as UITheme | undefined) ?? 'system'

  return <PreviewProviders locale={locale} Story={Story} theme={theme} />
}

const preview: Preview = {
  decorators: [withUIProviders],
  globalTypes: {
    locale: {
      description: 'UI locale (sets I18nProvider + document dir)',
      toolbar: {
        dynamicTitle: true,
        icon: 'globe',
        items: Locales.map((locale) => ({
          right: LOCALE_FLAGS[locale],
          title: nativeName(locale),
          value: locale,
        })),
        title: 'Locale',
      },
    },
    theme: {
      description: 'ThemeProvider mode (data-theme)',
      toolbar: {
        dynamicTitle: true,
        icon: 'mirror',
        items: [
          { icon: 'browser', title: 'System', value: 'system' },
          { icon: 'sun', title: 'Light', value: 'light' },
          { icon: 'moon', title: 'Dark', value: 'dark' },
        ],
        title: 'Theme',
      },
    },
  },
  initialGlobals: {
    locale: DEFAULT_LOCALE,
    theme: 'system',
  },
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: preferredJustPetsTheme(),
    },
  },
}

export default preview
