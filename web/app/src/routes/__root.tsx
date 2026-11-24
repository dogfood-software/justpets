import { Outlet, createRootRoute } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { UIProviders } from '@web/ui/provider'

import '../styles.css'

import { useDetectedLocale } from '#/features/i18n/hooks/use-locale'
import { I18nProvider } from '#/features/i18n/components/provider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const locale = useDetectedLocale()

  return (
    <>
      <I18nProvider locale={locale}>
        <UIProviders locale={locale} disableScripts>
          <Outlet />
        </UIProviders>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </I18nProvider>
    </>
  )
}
