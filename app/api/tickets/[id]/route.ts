import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { updateTicketSchema } from '@/lib/validations/ticket'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(['student', 'staff', 'technician', 'admin'])
  if ('error' in auth) return auth.error

  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tickets')
    .select('*, category:categories(*), created_by_profile:profiles!created_by(*), assigned_to_profile:profiles!assigned_to(*)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(['technician', 'admin'])
  if ('error' in auth) return auth.error

  const { id } = await params
  const supabase = await createClient()

  if (auth.effectiveRole === 'technician') {
    const { data: ticket } = await supabase
      .from('tickets')
      .select('assigned_to')
      .eq('id', id)
      .single()

    if (ticket?.assigned_to !== auth.effectiveUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const body = await req.json()
  const parsed = updateTicketSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tickets')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const { id } = await params
  const supabase = await createClient()
  const { error } = await supabase.from('tickets').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: null }, { status: 204 })
}
