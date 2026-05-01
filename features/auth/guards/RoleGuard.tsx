'use client'

import { useAuth } from '../hooks/useAuth'
import { redirect } from 'next/navigation'
import type { Role } from '@/lib/permissions'

interface RoleGuardProps {
  allowedRoles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { role, user, isLoading } = useAuth()
  if (isLoading) return null
  if (!role || !user) return redirect('/login')
  if (!allowedRoles.includes(role)) {
    return fallback ?? redirect(`/${role}/${user.id}/dashboard`)
  }
  return <>{children}</>
}
