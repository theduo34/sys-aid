'use client'

import { useTickets } from '@/features/tickets/hooks/useTickets'
import { TicketCard } from '@/features/tickets/components/TicketCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export function RecentTickets() {
  const { tickets, isLoading } = useTickets()
  const recent = tickets.slice(0, 5)

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col gap-2">
      {recent.map((t) => (
        <TicketCard key={t.id} ticket={t} />
      ))}
    </div>
  )
}
