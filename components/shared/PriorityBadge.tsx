import { cn } from '@/lib/utils'
import type { Priority } from '@/lib/constants'

interface PriorityBadgeProps {
  priority: Priority
}

const priorityStyles: Record<Priority, string> = {
  critical: 'bg-destructive/10 text-destructive',
  high:     'bg-warning/15 text-warning-foreground',
  medium:   'bg-secondary text-secondary-foreground',
  low:      'bg-muted text-muted-foreground',
}

const priorityLabels: Record<Priority, string> = {
  critical: 'P1 Critical',
  high:     'P2 High',
  medium:   'P3 Medium',
  low:      'P4 Low',
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', priorityStyles[priority])}>
      {priorityLabels[priority]}
    </span>
  )
}
