'use server'

import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'
import { SLA_HOURS } from '@/lib/constants'
import type { Role } from '@/lib/permissions'
import type { CreateTicketInput, UpdateTicketInput } from '@/lib/validations/ticket'

const defaultPriority: Record<Role, 'low' | 'medium' | 'high' | 'critical'> = {
  student:    'medium',
  staff:      'high',
  technician: 'medium',
  admin:      'medium',
}

async function findAutoAssignee(supabase: Awaited<ReturnType<typeof createClient>>, categoryId: string | null | undefined): Promise<string | null> {
  if (!categoryId) return null

  const { data: category } = await supabase
    .from('categories')
    .select('department')
    .eq('id', categoryId)
    .single()

  if (!category?.department) return null

  // Find technicians in the same department
  const { data: technicians } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'technician')
    .eq('department', category.department)

  if (!technicians?.length) return null

  // Pick the one with fewest open tickets
  const counts = await Promise.all(
    technicians.map(async (t) => {
      const { count } = await supabase
        .from('tickets')
        .select('id', { count: 'exact', head: true })
        .eq('assigned_to', t.id)
        .in('status', ['open', 'assigned', 'in_progress', 'pending'])
      return { id: t.id, count: count ?? 0 }
    })
  )

  counts.sort((a, b) => a.count - b.count)
  return counts[0]?.id ?? null
}

export async function createTicket(data: CreateTicketInput, userRole: Role) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized' } }

  const priority = data.priority ?? defaultPriority[userRole]
  const slaHours = SLA_HOURS[priority].resolution
  const sla_deadline = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()

  const assignee = await findAutoAssignee(supabase, data.category_id)
  const status = assignee ? 'assigned' : 'open'

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({
      title:          data.title,
      description:    data.description,
      category_id:    data.category_id ?? null,
      attachment_url: data.attachment_url ?? null,
      priority,
      sla_deadline,
      created_by:     user.id,
      assigned_to:    assignee,
      status,
    })
    .select()
    .single()

  if (ticket && !error) {
    await createNotification({
      userId: user.id,
      type:   'ticket_created',
      title:  'Ticket submitted',
      body:   `Your ticket "${data.title}" has been received and is being reviewed.`,
      link:   `tickets/${ticket.id}`,
    })

    if (assignee) {
      await createNotification({
        userId: assignee,
        type:   'ticket_assigned',
        title:  'New ticket assigned',
        body:   `"${data.title}" has been assigned to you.`,
        link:   'queue',
      })
    }
  }

  return { data: ticket, error }
}

export async function updateTicket(id: string, updates: UpdateTicketInput) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function assignTicket(ticketId: string, technicianId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tickets')
    .update({ assigned_to: technicianId, status: 'assigned' })
    .eq('id', ticketId)
    .select()
    .single()

  return { data, error }
}

export async function resolveTicket(ticketId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tickets')
    .update({ status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('id', ticketId)
    .select()
    .single()

  return { data, error }
}

export async function closeTicket(ticketId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tickets')
    .update({ status: 'closed' })
    .eq('id', ticketId)
    .select()
    .single()

  return { data, error }
}
