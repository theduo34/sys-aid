import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { createCommentSchema } from '@/lib/validations/comment'
import { can } from '@/lib/permissions'
import { z } from 'zod'

const bodySchema = createCommentSchema.extend({
  ticket_id: z.string().uuid('ticket_id must be a valid UUID'),
})

export async function POST(req: Request) {
  const auth = await requireRole(['student', 'staff', 'technician', 'admin'])
  if ('error' in auth) return auth.error

  const raw = await req.json()
  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { ticket_id, body, is_internal } = parsed.data

  if (is_internal && !can(auth.effectiveRole, 'comments:create:internal')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert({ ticket_id, body, is_internal, author_id: auth.effectiveUserId })
    .select('*, author:profiles!author_id(id, full_name, role)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
