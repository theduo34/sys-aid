'use client'

import { useAuth } from '../hooks/useAuth'
import { redirect } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null
  if (!isAuthenticated) redirect('/login')

  return <>{children}</>
}
