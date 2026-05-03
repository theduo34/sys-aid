import { cn } from '@/lib/utils'
import type { TicketStatus } from '@/lib/constants'

interface StatusBadgeProps {
  status: TicketStatus
}

const statusStyles: Record<TicketStatus, string> = {
  open:        'bg-muted text-muted-foreground',
  assigned:    'bg-secondary text-secondary-foreground',
  in_progress: 'bg-primary/10 text-primary',
  pending:     'bg-warning/15 text-warning-foreground',
  resolved:    'bg-muted text-muted-foreground',
  closed:      'bg-muted/60 text-muted-foreground',
}

const statusLabels: Record<TicketStatus, string> = {
  open:        'Open',
  assigned:    'Assigned',
  in_progress: 'In Progress',
  pending:     'Pending',
  resolved:    'Resolved',
  closed:      'Closed',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', statusStyles[status])}>
      {statusLabels[status]}
    </span>
  )
}
