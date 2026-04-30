'use client'

import { useAgentQueue } from '../hooks/useAgentQueue'
import { TicketCard } from '@/features/tickets/components/TicketCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'

export function AgentQueue() {
  const { tickets, isLoading } = useAgentQueue()

  if (isLoading) return <LoadingSpinner />
  if (!tickets.length) return <EmptyState message="Queue is clear." />

  return (
    <div className="flex flex-col gap-2">
      {tickets.map((t) => (
        <div
          key={t.id}
          className={cn(t.sla_deadline && new Date(t.sla_deadline) < new Date() && 'bg-destructive/5')}
        >
          <TicketCard ticket={t} />
        </div>
      ))}
    </div>
  )
}
