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
  const { role } = useAuth()
  if (!role || !allowedRoles.includes(role)) {
    return fallback ?? redirect('/dashboard')
  }
  return <>{children}</>
}
