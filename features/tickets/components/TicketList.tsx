'use client'

import { useState } from 'react'
import { useTickets } from '../hooks/useTickets'
import { useBasePath } from '@/hooks/useBasePath'
import { TicketCard } from './TicketCard'
import { TicketFilters } from './TicketFilters'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

function TicketCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="flex shrink-0 items-center gap-1.5">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-3 w-2/3 rounded" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-3 w-1 rounded-full" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
    </div>
  )
}

export function TicketList() {
  const { tickets, isLoading, isLoadingMore, hasMore, loadMore } = useTickets()
  const base = useBasePath()
  const [statusFilter, setStatusFilter]     = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const filtered = tickets.filter((t) => {
    if (statusFilter   && t.status   !== statusFilter)   return false
    if (priorityFilter && t.priority !== priorityFilter) return false
    return true
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <TicketFilters onStatusChange={setStatusFilter} onPriorityChange={setPriorityFilter} />
        </div>
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => <TicketCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <TicketFilters
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
        <span className="shrink-0 text-xs text-muted-foreground">
          {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
        </span>
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
          {isLoadingMore && [...Array(3)].map((_, i) => <TicketCardSkeleton key={`more-${i}`} />)}
        </div>
      )}

      {hasMore && !statusFilter && !priorityFilter && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading…' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}
