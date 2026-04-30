import { TicketDetail } from '@/features/tickets/components/TicketDetail'
import { CommentThread } from '@/features/comments/components/CommentThread'
import { PageHeader } from '@/components/shared/PageHeader'

interface TicketDetailPageProps {
  ticketId: string
}

export function TicketDetailPage({ ticketId }: TicketDetailPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Ticket" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TicketDetail ticketId={ticketId} />
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-foreground">Comments</h2>
            <CommentThread ticketId={ticketId} />
          </section>
        </div>
      </div>
    </div>
  )
}
