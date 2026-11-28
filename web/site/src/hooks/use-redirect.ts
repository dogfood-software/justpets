import { useSearchParams } from 'next/navigation'

const DEFAULT_CALLBACK_URL = '/'

function safeCallbackUrl(redirect: string | null): string {
  if (
    redirect?.startsWith('/') &&
    !redirect.startsWith('//') &&
    !redirect.toLowerCase().startsWith('/javascript:')
  ) {
    return redirect
  }
  return DEFAULT_CALLBACK_URL
}

export function useRedirect(key = 'redirect') {
  const searchParams = useSearchParams()
  return safeCallbackUrl(searchParams.get(key))
}
