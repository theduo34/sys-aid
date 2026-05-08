import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'
import { reviewRoleRequestSchema } from '@/lib/validations/role-request'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const { id } = await params
  const body = await req.json()
  const parsed = reviewRoleRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: request } = await supabase
    .from('role_requests')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

  await supabase
    .from('role_requests')
    .update({ status: parsed.data.status, reviewed_by: auth.user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (parsed.data.status === 'approved') {
    await supabase
      .from('profiles')
      .update({ role: 'staff' })
      .eq('id', request.user_id)

    await createNotification({
      userId: request.user_id,
      type:   'role_approved',
      title:  'Staff access granted',
      body:   'Your request for staff access has been approved. Your account has been upgraded.',
      link:   'dashboard',
    })
  } else if (parsed.data.status === 'rejected') {
    await createNotification({
      userId: request.user_id,
      type:   'role_rejected',
      title:  'Staff request not approved',
      body:   'Your request for staff access was not approved at this time.',
      link:   null,
    })
  }

  return NextResponse.json({ data: { ok: true } })
}
