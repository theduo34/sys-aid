'use client'

import { useState } from 'react'
import { useAgentQueue } from '../hooks/useAgentQueue'
import { useBasePath } from '@/hooks/useBasePath'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { TicketCard } from '@/features/tickets/components/TicketCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { useCategories } from '@/features/tickets/hooks/useCategories'
import { Button } from '@/components/ui/button'
import { TICKET_STATUSES, PRIORITIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { TicketStatus, Priority } from '@/lib/constants'

export function AgentQueue() {
  const { tickets, isLoading, isLoadingMore, hasMore, loadMore } = useAgentQueue()
  const { categories } = useCategories()
  const base = useBasePath()
  const { user, role } = useAuth()

  const [statusFilter,   setStatusFilter]   = useState<TicketStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [assignFilter,   setAssignFilter]   = useState<'all' | 'mine' | 'unassigned'>(
    role === 'technician' ? 'mine' : 'all'
  )

  const filtered = tickets.filter((t) => {
    if (statusFilter   && t.status   !== statusFilter)   return false
    if (priorityFilter && t.priority !== priorityFilter) return false
    if (categoryFilter && t.category_id !== categoryFilter) return false
    if (assignFilter === 'mine'       && t.assigned_to !== user?.id) return false
    if (assignFilter === 'unassigned' && t.assigned_to != null)      return false
    return true
  })

  const selectCls =
    'h-8 rounded-md border border-border bg-card px-2.5 text-xs text-foreground ' +
    'focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer'

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TicketStatus | '')} className={selectCls}>
          <option value="">All statuses</option>
          {TICKET_STATUSES.filter((s) => s !== 'resolved' && s !== 'closed').map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as Priority | '')} className={selectCls}>
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectCls}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select value={assignFilter} onChange={(e) => setAssignFilter(e.target.value as typeof assignFilter)} className={selectCls}>
          <option value="all">All tickets</option>
          <option value="mine">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
        </select>

        <span className="ms-auto text-xs text-muted-foreground">
          {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {!filtered.length ? (
        <EmptyState message="No tickets match your filters." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((t) => {
            const isOverdue = t.sla_deadline && new Date(t.sla_deadline) < new Date()
            return (
              <div
                key={t.id}
                className={cn('rounded-lg', isOverdue && 'ring-1 ring-destructive/30 bg-destructive/5')}
              >
                <TicketCard ticket={t} basePath={base} />
              </div>
            )
          })}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading…' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}
