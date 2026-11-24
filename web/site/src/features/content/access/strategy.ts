import { cache } from 'react'

import type { AuthStrategy } from 'payload'
import { errorAttributes } from '@libraries/attributes'
// import { hasCmsAccess, parseBetterAuthRoles } from "./roles";
// import { upsertPayloadUserFromSession } from "./sync-user";

import type { Session } from '@backend/api/app'
import type { Payload } from 'payload'
import type { User } from '@/features/content/payload-types'
import { cookies as getCookies, headers as getHeaders } from 'next/headers'
import { env } from '@/env'

export const betterAuthStrategy: AuthStrategy = {
  authenticate: async ({ payload }) => {
    const log = payload.logger.child({ module: 'better-auth-strategy' })
    try {
      const session = await getBetterAuthSession()
      if (!session) {
        log?.info('no authentication session for CMS')
        return { user: null }
      }

      // only admins can authenticate, TODO: add more roles in the future
      // This includes for the API... all data is pulled server side and rendered.
      // General should not be able to access the CMS at all
      // and ideally get a 404 page rather than an auth redirect
      const roles = parseBetterAuthRoles(session.user.role)
      if (false === roles?.includes('admin')) {
        log?.info({ id: session.user.id, roles }, 'denied CMS access')
        return { user: null }
      }

      const user = await upsertPayloadUserFromSession(payload, session.user)
      log?.info({ id: user.id }, 'authenticated & upserted for CMS')
      return { user }
    } catch (error) {
      log?.error(errorAttributes(error), 'CMS authenticate failed')
      return { user: null }
    }
  },
  name: 'better-auth',
}

// Cache this per request
const getBetterAuthSession = cache(async function getBetterAuthSession(): Promise<Session | null> {
  const [headers, cookies] = await Promise.all([getHeaders(), getCookies()])
  const baseUrl = env.API_SERVER_URL

  // Skip the network hop when we don't need it
  if (
    !cookies.has('justpets.session_token') && // browser cookie present
    !headers.has('Authorization') // API Key/OAuth Token (MCP & Rest API)
  ) {
    return null
  }

  // call the API over the local network which pulls the session from Redis/PostGres
  const response = await fetch(`${baseUrl}/api/auth/get-session`, {
    cache: 'no-store',
    headers: headers,
    method: 'GET',
    opentelemetry: {
      propagateContext: true,
      spanName: 'site.get-session',
    },
  })

  // if we don't have a 200 response code something failed badly, auth is broken
  if (!response.ok) {
    throw new Error(`better-auth get-session failed: ${response.status} ${response.statusText}`)
  }

  // Validate not null session
  const data: unknown = await response.json()
  if (data === null) {
    return null
  }

  // TODO: forward any cookies along

  // quick shape validation
  if (
    typeof data !== 'object' ||
    !('user' in data) ||
    data.user === null ||
    typeof data.user !== 'object'
  ) {
    return null
  }

  // returns the data
  return data as Session
})

// import { parseBetterAuthRoles } from "./roles";

type PayloadUserRole = NonNullable<User['roles']>[number]

/** Lean Mongo upsert result — dates are Date objects, id is `_id`. */
type MongoUserDoc = Omit<User, 'collection' | 'createdAt' | 'id' | 'roles' | 'updatedAt'> & {
  _id: { toString: () => string }
  createdAt: Date | string
  roles?: string[]
  updatedAt: Date | string
}

const toIso = (value: Date | string): string =>
  value instanceof Date ? value.toISOString() : value

const toPayloadRoles = (roles: string[]): PayloadUserRole[] =>
  roles.filter((role): role is PayloadUserRole => role === 'admin' || role === 'user')

async function upsertPayloadUserFromSession(
  payload: Payload,
  sessionUser: Session['user'],
): Promise<User> {
  const Model = payload.db.collections.users
  if (!Model) {
    throw new Error('Payload users collection model is not initialized')
  }

  // const roles = parseBetterAuthRoles(sessionUser.role);
  const now = new Date()
  const roles = parseBetterAuthRoles(sessionUser.role)

  const doc = (await Model.findOneAndUpdate(
    { userId: sessionUser.id },
    {
      $set: {
        email: sessionUser.email,
        image: sessionUser.image ?? null,
        name: sessionUser.name ?? null,
        roles,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
        userId: sessionUser.id,
      },
    },
    { lean: true, new: true, upsert: true },
  )) as MongoUserDoc | null

  if (!doc) {
    throw new Error('Failed to upsert Payload user from better-auth session')
  }

  return {
    collection: 'users',
    createdAt: toIso(doc.createdAt),
    email: doc.email,
    id: doc._id.toString(),
    // image: doc.image,
    name: doc.name,
    roles: toPayloadRoles(doc.roles ?? roles),
    updatedAt: toIso(doc.updatedAt),
    userId: doc.userId,
  }
}

function parseBetterAuthRoles(role: string | null | undefined): string[] {
  return (
    role
      ?.split(',')
      .map((part) => part.trim())
      .filter(Boolean) || []
  )
}
