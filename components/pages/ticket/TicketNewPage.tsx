import { TicketForm } from '@/features/tickets/components/TicketForm'
import { PageHeader } from '@/components/shared/PageHeader'

export function TicketNewPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New Ticket" />
      <div className="max-w-xl">
        <TicketForm />
      </div>
    </div>
  )
}
