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
  if (!ticket) return <p className="text-sm text-muted-foreground">Ticket not found.</p>

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-base font-semibold text-foreground leading-snug">{ticket.title}</h2>
          <div className="flex shrink-0 items-center gap-1.5">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>
        {ticket.sla_deadline && <SLACountdown deadline={ticket.sla_deadline} />}
      </div>

      <div className="border-t border-border pt-5">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {ticket.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-3">
        {ticket.category && (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Category</span>
            <span className="text-sm text-foreground">{ticket.category.name}</span>
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Submitted</span>
          <span className="text-sm text-foreground">
            {new Date(ticket.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>
        {ticket.assigned_to_profile && (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Assigned to</span>
            <span className="text-sm text-foreground">{ticket.assigned_to_profile.full_name}</span>
          </div>
        )}
      </div>

    </div>
  )
}
