'use client'

import { useTickets } from '../hooks/useTickets'
import { TicketCard } from './TicketCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export function TicketList() {
  const { tickets, isLoading } = useTickets()

  if (isLoading) return <LoadingSpinner />
  if (!tickets.length) return <EmptyState message="No tickets yet." />

  return (
    <div className="flex flex-col gap-2">
      {tickets.map((t) => (
        <TicketCard key={t.id} ticket={t} />
      ))}
    </div>
  )
}
