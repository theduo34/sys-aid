'use client'

import { useTicket } from '../hooks/useTicket'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { SLACountdown } from './SLACountdown'

interface TicketDetailProps {
  ticketId: string
}

export function TicketDetail({ ticketId }: TicketDetailProps) {
  const { ticket, isLoading } = useTicket(ticketId)

  if (isLoading) return <LoadingSpinner />
  if (!ticket) return <p className="text-muted-foreground">Ticket not found.</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-lg font-semibold text-foreground">{ticket.title}</h1>
        <div className="flex shrink-0 items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>
      {ticket.sla_deadline && <SLACountdown deadline={ticket.sla_deadline} />}
      <p className="text-sm text-foreground">{ticket.description}</p>
    </div>
  )
}
