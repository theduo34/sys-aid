'use client'

import { TICKET_STATUSES, PRIORITIES } from '@/lib/constants'

interface TicketFiltersProps {
  onStatusChange?: (status: string) => void
  onPriorityChange?: (priority: string) => void
}

export function TicketFilters({ onStatusChange, onPriorityChange }: TicketFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        onChange={(e) => onStatusChange?.(e.target.value)}
        className="border border-border bg-background px-2 py-1 text-sm text-foreground"
      >
        <option value="">All statuses</option>
        {TICKET_STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>
      <select
        onChange={(e) => onPriorityChange?.(e.target.value)}
        className="border border-border bg-background px-2 py-1 text-sm text-foreground"
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  )
}
