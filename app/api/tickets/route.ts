import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { createTicketSchema } from '@/lib/validations/ticket'

export async function GET() {
  const auth = await requireRole(['student', 'staff', 'technician', 'admin'])
  if ('error' in auth) return auth.error

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tickets')
    .select('*, category:categories(*), created_by_profile:profiles!created_by(*), assigned_to_profile:profiles!assigned_to(*)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const auth = await requireRole(['student', 'staff', 'admin'])
  if ('error' in auth) return auth.error

  const body = await req.json()
  const parsed = createTicketSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { createTicket } = await import('@/features/tickets/actions/ticketActions')
  const { data, error } = await createTicket(parsed.data, auth.effectiveRole)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
