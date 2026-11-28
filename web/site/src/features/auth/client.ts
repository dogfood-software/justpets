import {
  adminClient,
  emailOTPClient,
  jwtClient,
  lastLoginMethodClient,
  organizationClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { passkeyClient } from '@better-auth/passkey/client'

export const authClient = createAuthClient({
  plugins: [
    passkeyClient(),
    jwtClient(),
    organizationClient(),
    adminClient(),
    emailOTPClient(),
    lastLoginMethodClient(),
  ],
})
