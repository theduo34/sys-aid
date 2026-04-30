'use client'

import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setItem = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof newValue === 'function' ? (newValue as (p: T) => T)(prev) : newValue
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(resolved))
        }
        return resolved
      })
    },
    [key]
  )

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === key && e.newValue !== null) {
        try { setValue(JSON.parse(e.newValue) as T) } catch { /* ignore */ }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [value, setItem] as const
}
