'use client'

import { useState } from 'react'
import { updateTicket } from '../actions/ticketActions'
import { toast } from 'sonner'
import { TICKET_STATUSES } from '@/lib/constants'
import type { Ticket } from '../types/ticket.types'

interface TicketStatusSelectProps {
  ticketId: string
  currentStatus: Ticket['status']
}

export function TicketStatusSelect({ ticketId, currentStatus }: TicketStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Ticket['status']
    const { error } = await updateTicket(ticketId, { status: next })
    if (error) {
      toast.error('Failed to update status.')
    } else {
      setStatus(next)
      toast.success('Status updated.')
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      className="border border-border bg-background px-2 py-1 text-sm text-foreground"
    >
      {TICKET_STATUSES.map((s) => (
        <option key={s} value={s}>{s.replace('_', ' ')}</option>
      ))}
    </select>
  )
}
