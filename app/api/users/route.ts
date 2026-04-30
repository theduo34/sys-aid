import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { updateUserSchema } from '@/lib/validations/user'

export async function GET() {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PATCH(req: Request) {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const { userId, ...updates } = await req.json()
  const parsed = updateUserSchema.safeParse(updates)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(parsed.data)
    .eq('id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
