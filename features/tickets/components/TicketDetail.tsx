'use client'

import { useTicket } from '../hooks/useTicket'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { Avatar } from '@/components/shared/Avatar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { SLACountdown } from './SLACountdown'
import { TicketTimeline } from './TicketTimeline'
import { PaperclipIcon } from '@phosphor-icons/react'

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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground leading-snug flex-1">
            {ticket.title}
          </h2>
          <div className="flex shrink-0 items-center gap-1.5">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <TicketTimeline currentStatus={ticket.status} />

        {ticket.sla_deadline && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
          <SLACountdown deadline={ticket.sla_deadline} />
        )}
      </div>

      <div className="border-t border-border pt-5">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {ticket.description}
        </p>
      </div>

      {ticket.attachment_url && (
        <a
          href={ticket.attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-3 py-2 w-fit"
        >
          <PaperclipIcon className="size-3.5" />
          View attachment
        </a>
      )}

      <div className="grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Submitted by</span>
          <div className="flex items-center gap-2">
            <Avatar name={ticket.created_by_profile?.full_name ?? '?'} className="size-6 text-[10px]" />
            <span className="text-sm text-foreground">
              {ticket.created_by_profile?.full_name ?? 'Unknown'}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Submitted</span>
          <span className="text-sm text-foreground">
            {new Date(ticket.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>
        {ticket.category && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Category</span>
            <span className="text-sm text-foreground">{ticket.category.name}</span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Assigned to</span>
          <span className="text-sm text-foreground">
            {ticket.assigned_to_profile?.full_name ?? 'Unassigned'}
          </span>
        </div>
        {ticket.resolved_at && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Resolved</span>
            <span className="text-sm text-foreground">
              {new Date(ticket.resolved_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
