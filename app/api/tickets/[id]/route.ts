import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'
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

  const { data: prev } = await supabase
    .from('tickets')
    .select('status, assigned_to, created_by, title')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('tickets')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (prev && data) {
    const statusLabels: Record<string, string> = {
      assigned:    'assigned to a technician',
      in_progress: 'in progress',
      pending:     'pending your response',
      resolved:    'resolved',
      closed:      'closed',
    }
    if (parsed.data.status && parsed.data.status !== prev.status) {
      const label = statusLabels[parsed.data.status] ?? parsed.data.status
      await createNotification({
        userId: prev.created_by,
        type:   'ticket_status',
        title:  'Ticket status updated',
        body:   `Your ticket "${prev.title}" is now ${label}.`,
        link:   `tickets/${id}`,
      })
    }
    if (parsed.data.assigned_to && parsed.data.assigned_to !== prev.assigned_to) {
      await createNotification({
        userId: parsed.data.assigned_to,
        type:   'ticket_assigned',
        title:  'Ticket assigned to you',
        body:   `"${prev.title}" has been assigned to you.`,
        link:   'queue',
      })
    }
  }

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
