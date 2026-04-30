import { cn } from '@/lib/utils'
import type { Priority } from '@/lib/constants'

interface PriorityBadgeProps {
  priority: Priority
}

const priorityStyles: Record<Priority, string> = {
  critical: 'bg-destructive/10 text-destructive',
  high:     'bg-warning/10 text-warning',
  medium:   'bg-secondary text-secondary-foreground',
  low:      'bg-muted text-muted-foreground',
}

const priorityLabels: Record<Priority, string> = {
  critical: 'P1',
  high:     'P2',
  medium:   'P3',
  low:      'P4',
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={cn('px-2 py-0.5 text-xs font-medium', priorityStyles[priority])}>
      {priorityLabels[priority]}
    </span>
  )
}
