import { TicketList } from '@/features/tickets/components/TicketList'
import { PageHeader } from '@/components/shared/PageHeader'

export function TicketsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Tickets" action={{ label: 'New Ticket', href: '/tickets/new' }} />
      <TicketList />
    </div>
  )
}
