'use client'

import { TICKET_STATUSES, PRIORITIES } from '@/lib/constants'

interface TicketFiltersProps {
  onStatusChange?: (status: string) => void
  onPriorityChange?: (priority: string) => void
}

const selectClass =
  'h-8 rounded-md border border-border bg-card px-2.5 pr-7 text-xs text-foreground ' +
  'focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer appearance-none ' +
  'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")] ' +
  'bg-no-repeat bg-[right_0.5rem_center]'

export function TicketFilters({ onStatusChange, onPriorityChange }: TicketFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        onChange={(e) => onStatusChange?.(e.target.value)}
        className={selectClass}
      >
        <option value="">All statuses</option>
        {TICKET_STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>

      <select
        onChange={(e) => onPriorityChange?.(e.target.value)}
        className={selectClass}
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  )
}
