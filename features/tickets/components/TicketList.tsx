'use client'

import { useTickets } from '../hooks/useTickets'
import { useBasePath } from '@/hooks/useBasePath'
import { TicketCard } from './TicketCard'
import { TicketFilters } from './TicketFilters'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useState } from 'react'

export function TicketList() {
  const { tickets, isLoading } = useTickets()
  const base = useBasePath()
  const [statusFilter, setStatusFilter]     = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const filtered = tickets.filter((t) => {
    if (statusFilter   && t.status   !== statusFilter)   return false
    if (priorityFilter && t.priority !== priorityFilter) return false
    return true
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <TicketFilters
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
        {!isLoading && (
          <span className="shrink-0 text-xs text-muted-foreground">
            {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {!filtered.length ? (
        <EmptyState
          message="No tickets found."
          description={statusFilter || priorityFilter ? 'Try adjusting your filters.' : 'Submit your first IT support ticket to get started.'}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((t) => (
            <TicketCard key={t.id} ticket={t} basePath={base} />
          ))}
        </div>
      )}
    </div>
  )
}
