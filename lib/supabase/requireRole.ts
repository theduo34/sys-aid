import { createClient } from './server'
import { getImpersonationSession } from '@/lib/impersonation'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Role } from '@/lib/permissions'

export async function requireRole(allowedRoles: Role[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !allowedRoles.includes(profile.role as Role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  const cookieStore = await cookies()
  const impSession = getImpersonationSession(cookieStore)
  const effectiveUserId = impSession?.targetUserId ?? user.id
  const effectiveRole   = impSession?.targetRole   ?? (profile.role as Role)

  return {
    user,
    role: profile.role as Role,
    effectiveUserId,
    effectiveRole,
    isImpersonating: !!impSession,
  }
}
