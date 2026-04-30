import type { Ticket } from '../types/ticket.types'
import { TICKET_STATUSES } from '@/lib/constants'

interface TicketTimelineProps {
  currentStatus: Ticket['status']
}

export function TicketTimeline({ currentStatus }: TicketTimelineProps) {
  const activeIndex = TICKET_STATUSES.indexOf(currentStatus)

  return (
    <ol className="flex items-center gap-2">
      {TICKET_STATUSES.map((status, i) => (
        <li key={status} className="flex items-center gap-2">
          <span className={`text-xs capitalize ${i <= activeIndex ? 'text-primary' : 'text-muted-foreground'}`}>
            {status.replace('_', ' ')}
          </span>
          {i < TICKET_STATUSES.length - 1 && (
            <span className="text-muted-foreground">→</span>
          )}
        </li>
      ))}
    </ol>
  )
}
