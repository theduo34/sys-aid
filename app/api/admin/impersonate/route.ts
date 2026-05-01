import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { getImpersonationSession, IMPERSONATION_COOKIE } from '@/lib/impersonation'
import { cookies } from 'next/headers'
import type { ImpersonationSession } from '@/lib/impersonation'

export async function POST(req: Request) {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const { targetUserId, reason } = await req.json()

  if (!targetUserId) {
    return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: target } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', targetUserId)
    .single()

  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  if (target.role === 'admin') {
    return NextResponse.json({ error: 'Cannot impersonate admin accounts' }, { status: 403 })
  }

  await supabase.from('impersonation_log').insert({
    admin_id: auth.user.id,
    target_user_id: targetUserId,
    reason: reason ?? null,
  })

  const session: ImpersonationSession = {
    realAdminId: auth.user.id,
    targetUserId,
    targetRole: target.role as ImpersonationSession['targetRole'],
    startedAt: new Date().toISOString(),
  }

  const res = NextResponse.json({ data: { ok: true } })
  res.cookies.set(IMPERSONATION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const cookieStore = await cookies()
  const session = getImpersonationSession(cookieStore)

  if (session) {
    const supabase = await createClient()
    await supabase
      .from('impersonation_log')
      .update({ ended_at: new Date().toISOString() })
      .eq('admin_id', session.realAdminId)
      .is('ended_at', null)
  }

  const res = NextResponse.json({ data: { ok: true } })
  res.cookies.delete(IMPERSONATION_COOKIE)
  return res
}
