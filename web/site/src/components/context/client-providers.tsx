'use client'

import type { Locale } from '@libraries/i18n'
import { RouterProvider, UIProviders } from '@web/ui/provider'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { NextIntlClientProvider, type Timezone } from 'next-intl'
import type React from 'react'
// import ConsentManagerClient from "@/features/consent/provider";
import { useClientTimeZone } from '@/features/i18n/hooks/use-client-timezone'
import { getPathname } from '@/features/i18n/navigation'

export function ClientProviders({
  children,
  locale,
  serverTimeZone,
}: {
  children: React.ReactNode
  locale: Locale
  /** Server timezone to prevent hydration errors on Dates */
  serverTimeZone?: Timezone
}) {
  const router = useRouter()
  const timeZone = useClientTimeZone(serverTimeZone)

  // converts a cononical path (e.g. /about to the current locale variant)
  const toPath = (href: string) => getPathname({ href: href as Route, locale })

  return (
    // TODO: Add Error Handling here too
    // https://next-intl.dev/docs/usage/configuration#nextintlclientprovider-non-serializable-props
    <NextIntlClientProvider locale={locale} timeZone={timeZone}>
      <RouterProvider
        navigate={(href, options) => {
          router.push(toPath(href) as Route, options)
        }}
        useHref={toPath}
      >
        <UIProviders locale={locale}>
          {children}
          {/* <ConsentManagerClient>{children}</ConsentManagerClient> */}
        </UIProviders>
      </RouterProvider>
    </NextIntlClientProvider>
  )
}
