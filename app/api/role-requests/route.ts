import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { createRoleRequestSchema } from '@/lib/validations/role-request'

export async function GET() {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('role_requests')
    .select('*, user:profiles!user_id(id, full_name, role, department)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const auth = await requireRole(['student'])
  if ('error' in auth) return auth.error

  const body = await req.json()
  const parsed = createRoleRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors.reason?.[0] ?? 'Invalid input' }, { status: 400 })
  }

  const supabase = await createClient()

  // One pending request at a time
  const { data: existing } = await supabase
    .from('role_requests')
    .select('id')
    .eq('user_id', auth.effectiveUserId)
    .eq('status', 'pending')
    .single()

  if (existing) {
    return NextResponse.json({ error: 'You already have a pending request.' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('role_requests')
    .insert({ user_id: auth.effectiveUserId, requested_role: 'staff', reason: parsed.data.reason })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
