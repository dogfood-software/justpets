'use client'

import { useTranslations } from 'next-intl'
import { Button, Icon, toast } from '@web/ui'
import { faApple, faFacebook, faGoogle } from '@web/ui/icons/brands'
import { faEnvelope, faUserKey } from '@web/ui/icons/solid'
import { authClient } from '@/features/auth/client'
import { useRedirect } from '@/hooks/use-redirect'
import { useEffect, useState } from 'react'
import { useRouter } from '@/features/i18n/navigation'

export function LoginClientPage() {
  const t = useTranslations('site.pages.login')
  const callbackURL = useRedirect()
  const router = useRouter()
  const [pending, setPending] = useState<'apple' | 'google' | 'facebook' | 'passkey' | null>(null)

  async function signInWithSocial(provider: 'apple' | 'google' | 'facebook') {
    try {
      setPending(provider)
      const { error } = await authClient.signIn.social({ callbackURL, provider })
      if (!error) {
        return
      }
      // Gateway / upstream failures often have an empty body — prefer a clear message.
      const isServerError = error.status >= 500
      toast.danger(
        isServerError || !error.message ? t('errors.social-auth', { provider }) : error.message,
      )
    } catch {
      toast.danger(t('errors.social-auth', { provider }))
    } finally {
      setPending(null)
    }
  }

  async function signInWithPasskey() {
    console.log('sign in with passkey')
    const { data, error } = await authClient.signIn.passkey({
      autoFill: false,
      // Optional extensions
      // extensions: { credProps: true },
      returnWebAuthnResponse: true,
      fetchOptions: {
        onSuccess(_context) {
          // Redirect to dashboard after successful authentication
          router.push(callbackURL)
        },
        onError(context) {
          toast.danger(context.error.message)
          // Handle authentication errors
          // console.error('Authentication failed:', context.error.message)
        },
      },
    })
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          fullWidth
          onPress={() => signInWithSocial('google')}
          variant="outline"
          size="lg"
          className="bg-white border-black text-black grow hover:scale-105 transition-all flex-wrap min-h-11 h-auto"
        >
          <Icon icon={faGoogle} invertRTL={false} className="text-black" />
          {t('sign-in-with.google')}
        </Button>
        <Button
          fullWidth
          variant="outline"
          onPress={() => signInWithSocial('apple')}
          size="lg"
          className="bg-black text-white grow hover:scale-105 transition-all flex-wrap min-h-11 h-auto"
        >
          <Icon icon={faApple} invertRTL={false} />
          {t('sign-in-with.apple')}
        </Button>
        <Button
          fullWidth
          variant="outline"
          onPress={() => signInWithSocial('facebook')}
          size="lg"
          className="bg-[#1877F2] text-white grow hover:scale-105 transition-all flex-wrap min-h-11 h-auto"
        >
          <Icon icon={faFacebook} invertRTL={false} />
          {t('sign-in-with.facebook')}
        </Button>
        <Button
          fullWidth
          size="lg"
          onPress={signInWithPasskey}
          className="grow hover:scale-105 transition-all flex-wrap min-h-11 h-auto"
        >
          <Icon icon={faUserKey} />
          {t('sign-in-with.passkey')}
        </Button>
      </div>
      <hr />
    </>
  )
  return null
}
