import { TicketForm } from '@/features/tickets/components/TicketForm'

export function TicketNewPage() {
  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-lg border border-border bg-card p-6">
        <TicketForm />
      </div>
    </div>
  )
}
