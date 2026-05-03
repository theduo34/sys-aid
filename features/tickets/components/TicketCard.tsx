import type { TicketWithRelations } from '../types/ticket.types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import Link from 'next/link'

interface TicketCardProps {
  ticket: TicketWithRelations
  basePath: string
}

export function TicketCard({ ticket, basePath }: TicketCardProps) {
  const date = new Date(ticket.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link
      href={`${basePath}/tickets/${ticket.id}`}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 hover:border-foreground/20 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-foreground leading-snug line-clamp-2 flex-1">
          {ticket.title}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {ticket.description && (
        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {ticket.description}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{date}</span>
        {ticket.category && (
          <>
            <span>·</span>
            <span>{ticket.category.name}</span>
          </>
        )}
      </div>
    </Link>
  )
}
