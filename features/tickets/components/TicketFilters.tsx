'use client'

import { TICKET_STATUSES, PRIORITIES } from '@/lib/constants'

interface TicketFiltersProps {
  onStatusChange?: (status: string) => void
  onPriorityChange?: (priority: string) => void
}

const selectClass =
  'h-8 rounded-md border border-border bg-card px-2.5 text-xs text-foreground ' +
  'focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer'

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
