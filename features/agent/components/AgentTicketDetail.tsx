'use client'

import { useTicket } from '@/features/tickets/hooks/useTicket'
import { TicketDetail } from '@/features/tickets/components/TicketDetail'
import { CommentThread } from '@/features/comments/components/CommentThread'
import { TicketStatusSelect } from '@/features/tickets/components/TicketStatusSelect'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface AgentTicketDetailProps {
  ticketId: string
}

export function AgentTicketDetail({ ticketId }: AgentTicketDetailProps) {
  const { ticket, isLoading } = useTicket(ticketId)

  if (isLoading) return <LoadingSpinner />
  if (!ticket) return <p className="text-muted-foreground">Ticket not found.</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <TicketDetail ticketId={ticketId} />
        <TicketStatusSelect ticketId={ticketId} currentStatus={ticket.status} />
      </div>
      <CommentThread ticketId={ticketId} />
    </div>
  )
}
