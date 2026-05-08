'use client'

import { useState } from 'react'
import { updateTicket } from '../actions/ticketActions'
import { toast } from 'sonner'
import { TICKET_STATUSES } from '@/lib/constants'
import type { Ticket } from '../types/ticket.types'

const selectCls =
  'rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground ' +
  'focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer capitalize'

interface TicketStatusSelectProps {
  ticketId: string
  currentStatus: Ticket['status']
}

export function TicketStatusSelect({ ticketId, currentStatus }: TicketStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Ticket['status']
    setSaving(true)
    const updates = next === 'resolved'
      ? { status: next, resolved_at: new Date().toISOString() }
      : { status: next }
    try {
      const { error } = await updateTicket(ticketId, updates)
      if (error) {
        toast.error('Failed to update status.')
      } else {
        setStatus(next)
        toast.success('Status updated.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <select value={status} onChange={handleChange} disabled={saving} className={selectCls}>
      {TICKET_STATUSES.map((s) => (
        <option key={s} value={s}>{s.replace('_', ' ')}</option>
      ))}
    </select>
  )
}
