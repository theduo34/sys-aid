import { cn } from '@/lib/utils'
import type { TicketStatus } from '@/lib/constants'

interface StatusBadgeProps {
  status: TicketStatus
}

const statusStyles: Record<TicketStatus, string> = {
  open:        'bg-muted text-muted-foreground',
  assigned:    'bg-secondary text-secondary-foreground',
  in_progress: 'bg-primary/10 text-primary',
  pending:     'bg-warning/10 text-warning',
  resolved:    'bg-muted text-muted-foreground',
  closed:      'bg-muted/50 text-muted-foreground',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn('px-2 py-0.5 text-xs capitalize', statusStyles[status])}>
      {status.replace('_', ' ')}
    </span>
  )
}
