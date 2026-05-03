import { TicketDetail } from '@/features/tickets/components/TicketDetail'
import { CommentThread } from '@/features/comments/components/CommentThread'

interface TicketDetailPageProps {
  ticketId: string
}

export function TicketDetailPage({ ticketId }: TicketDetailPageProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

      <div className="md:col-span-2 flex flex-col gap-5">
        <div className="rounded-lg border border-border bg-card p-6">
          <TicketDetail ticketId={ticketId} />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Discussion
          </h2>
          <div className="rounded-lg border border-border bg-card p-5">
            <CommentThread ticketId={ticketId} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Details
        </h2>
        <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Submitted</span>
            <span className="text-foreground">Just now</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Assigned to</span>
            <span className="text-foreground">Unassigned</span>
          </div>
        </div>
      </div>

    </div>
  )
}
