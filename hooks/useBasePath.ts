'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'

export function useBasePath(): string {
  const { role, user } = useAuth()
  if (!role || !user) return ''
  return `/${role}/${user.id}`
}
