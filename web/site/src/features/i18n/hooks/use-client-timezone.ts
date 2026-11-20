'use client'

import type { Timezone } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

/** Hook to get the users current timezone. */
export function useClientTimeZone(initial?: Timezone) {
  // Initialize with the server timezone on the server render pass
  // This means that the times will shift from our hosting timezone (prod: Amsterdam)
  // to the users Timezone only after the initial render.
  // If this is an issue we can use a session cookie and update it in reqeust.ts
  const [timeZone, setTimeZone] = useState<string>(initial ?? getTimeZone())

  const syncTimezone = useCallback(() => {
    const tz = getTimeZone()

    // Baseline 2025 support
    cookieStore.set({
      name: 'tz',
      path: '/',
      sameSite: 'lax',
      value: tz,
      // omit expires → session
    })

    // gracefull fallback for use-client elements
    setTimeZone(tz)
  }, [])

  useEffect(() => {
    // Update the timezone to match the client during hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    syncTimezone()

    // Refresh the timezone when the tab is re-focused
    // just in case the user changed it in their settings (e.g. travel)
    function onVisibility() {
      if (document.visibilityState === 'visible') {
        syncTimezone() // refresh the timezone
      }
    }

    // Clean up the listener after ourselves, just to make sure there is no leak
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [syncTimezone])

  return timeZone
}

/** A simple utility function to get the current timezone on the Server or the Client */
function getTimeZone(): Timezone {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
