import { useEffect, useState } from 'react'

export function useCookie(name: string) {
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    cookieStore.get(name).then((c) => {
      if (!cancelled) {
        setValue(c?.value ?? null)
      }
    })

    const handler = (event: CookieChangeEvent) => {
      const deleted = event.deleted.find((c) => c.name === name)
      const changed = event.changed.find((c) => c.name === name)
      if (deleted) {
        setValue(null)
      } else if (changed) {
        setValue(changed.value ?? null)
      }
    }

    cookieStore.addEventListener('change', handler)
    return () => {
      cancelled = true
      cookieStore.removeEventListener('change', handler)
    }
  }, [name])

  return value
}
