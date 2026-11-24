import { useState, useEffect, useCallback } from 'react'

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/** Re-checks the system timezone when the tab becomes visible again
 *  (e.g. after traveling or changing OS timezone settings). */
export function useCurrentTimezone() {
  const [timezone, setTimezone] = useState<string>(getTimezone)

  const refresh = useCallback(() => {
    setTimezone((prev) => {
      const next = getTimezone()
      return next === prev ? prev : next
    })
  }, [])

  useEffect(() => {
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [refresh])

  return timezone
}
