'use client'

import { useBasePath } from '@/hooks/useBasePath'
import { TicketList } from '@/features/tickets/components/TicketList'
import { PageHeader } from '@/components/shared/PageHeader'

export function TicketsPage() {
  const base = useBasePath()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Tickets" action={{ label: 'New Ticket', href: `${base}/tickets/new` }} />
      <TicketList />
    </div>
  )
}
