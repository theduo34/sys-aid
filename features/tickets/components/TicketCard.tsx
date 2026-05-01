import type { TicketWithRelations } from '../types/ticket.types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import Link from 'next/link'

interface TicketCardProps {
  ticket: TicketWithRelations
  basePath: string
}

export function TicketCard({ ticket, basePath }: TicketCardProps) {
  return (
    <Link href={`${basePath}/tickets/${ticket.id}`} className="flex flex-col gap-2 border border-border p-4 hover:bg-muted/50">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-foreground">{ticket.title}</span>
        <div className="flex shrink-0 items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>
      <p className="truncate text-xs text-muted-foreground">{ticket.description}</p>
    </Link>
  )
}
