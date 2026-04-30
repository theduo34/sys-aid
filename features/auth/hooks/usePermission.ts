'use client'

import { useAuth } from './useAuth'
import { can, type Permission, type PermissionContext } from '@/lib/permissions'

export function usePermission(
  permission: Permission,
  context?: Omit<PermissionContext, 'userId'>
): boolean {
  const { role, user } = useAuth()
  if (!role) return false
  return can(role, permission, { userId: user?.id, ...context })
}
