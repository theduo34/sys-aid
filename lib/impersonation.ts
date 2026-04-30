import type { cookies } from 'next/headers'
import type { Role } from '@/lib/permissions'

export interface ImpersonationSession {
  realAdminId: string
  targetUserId: string
  targetRole: Role
  startedAt: string
}

// httpOnly cookie name for the impersonation session
export const IMPERSONATION_COOKIE = 'sysaid_impersonation'

export function getImpersonationSession(
  cookieStore: ReturnType<typeof cookies>
): ImpersonationSession | null {
  const raw = cookieStore.get(IMPERSONATION_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as ImpersonationSession
  } catch {
    return null
  }
}
