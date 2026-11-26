import './styles.css'

import { DEFAULT_LOCALE, dir, Locales } from '@libraries/i18n'
import type { Metadata } from 'next'
import type { Viewport } from 'next/types'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getLocale, getTimeZone } from 'next-intl/server'
import { ClientProviders } from '@/components/context/client-providers'
import { routing } from '@/features/i18n/routing'

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  let { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    locale = DEFAULT_LOCALE
  }

  return {
    title: {
      default: 'JustPets',
      template: '%s | JustPets',
    },
    robots: { index: false, follow: false },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await getLocale()
  const timeZone = await getTimeZone()

  return (
    <html
      className="bg-background font-sans antialiased"
      dir={dir(locale)}
      lang={locale}
      suppressHydrationWarning
    >
      <body className="contents">
        <NextIntlClientProvider locale={locale}>
          <ClientProviders locale={locale} serverTimeZone={timeZone}>
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return Locales.map((locale) => ({ locale }))
}
