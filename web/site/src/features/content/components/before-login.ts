import { redirect } from 'next/navigation'
import { getSafeRedirect } from 'payload/shared'

type BeforeLoginProps = {
  searchParams?: {
    redirect?: string
  }
}

/**
 * Payload login is disabled (external better-auth). Send visitors to the app login.
 */
export function BeforeLogin({ searchParams }: BeforeLoginProps) {
  const redirectTo = getSafeRedirect({
    fallbackTo: '/payload/admin',
    redirectTo: searchParams?.redirect ?? '/payload/admin',
  })
  redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`)
}
