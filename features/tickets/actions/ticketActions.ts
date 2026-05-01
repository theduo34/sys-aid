'use server'

import { createClient } from '@/lib/supabase/server'
import { SLA_HOURS } from '@/lib/constants'
import type { Role } from '@/lib/permissions'
import type { CreateTicketInput, UpdateTicketInput } from '@/lib/validations/ticket'

const defaultPriority: Record<Role, 'low' | 'medium' | 'high' | 'critical'> = {
  student:    'medium',
  staff:      'high', // staff tickets default to high per spec
  technician: 'medium',
  admin:      'medium',
}

export async function createTicket(data: CreateTicketInput, userRole: Role) {
  const supabase = await createClient()
  const priority = data.priority ?? defaultPriority[userRole]
  const slaHours = SLA_HOURS[priority].resolution
  const sla_deadline = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({ ...data, priority, sla_deadline })
    .select()
    .single()

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
