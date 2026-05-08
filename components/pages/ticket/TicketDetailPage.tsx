'use client'

import { useTicket } from '@/features/tickets/hooks/useTicket'
import { TicketDetail } from '@/features/tickets/components/TicketDetail'
import { TicketStatusSelect } from '@/features/tickets/components/TicketStatusSelect'
import { CommentThread } from '@/features/comments/components/CommentThread'
import { AssignTicketSelect } from '@/features/agent/components/AssignTicketSelect'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { closeTicket, resolveTicket } from '@/features/tickets/actions/ticketActions'
import { toast } from 'sonner'
import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react'

interface TicketDetailPageProps {
  ticketId: string
}

export function TicketDetailPage({ ticketId }: TicketDetailPageProps) {
  const { ticket, isLoading } = useTicket(ticketId)
  const { user } = useAuth()
  const canUpdateAssigned = usePermission('tickets:update:assigned', {
    assignedToId: ticket?.assigned_to ?? undefined,
  })
  const canUpdateAll   = usePermission('tickets:update:all')
  const canAssignAny   = usePermission('tickets:assign:any')
  const canReadInternal = usePermission('comments:read:internal')
  const [acting, setActing] = useState(false)

  if (isLoading) return <LoadingSpinner />
  if (!ticket) return <p className="text-sm text-muted-foreground">Ticket not found.</p>

  const isOwner    = ticket.created_by === user?.id
  const canAct     = canUpdateAssigned || canUpdateAll
  const isResolved = ticket.status === 'resolved'
  const isClosed   = ticket.status === 'closed'

  async function handleClose() {
    setActing(true)
    const { error } = await closeTicket(ticketId)
    if (error) toast.error('Failed to close ticket.')
    else toast.success('Ticket closed.')
    setActing(false)
  }

  async function handleResolve() {
    setActing(true)
    const { error } = await resolveTicket(ticketId)
    if (error) toast.error('Failed to resolve ticket.')
    else toast.success('Ticket marked as resolved.')
    setActing(false)
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      {/* Agent / Admin controls */}
      {canAct && !isClosed && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <TicketStatusSelect ticketId={ticketId} currentStatus={ticket.status} />
          </div>

          {canAssignAny && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Assign</span>
              <AssignTicketSelect ticketId={ticketId} currentAssignee={ticket.assigned_to} />
            </div>
          )}

          {!isResolved && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleResolve}
              disabled={acting}
              className="ms-auto"
            >
              <CheckCircleIcon data-icon="inline-start" />
              {acting ? 'Saving…' : 'Mark resolved'}
            </Button>
          )}
        </div>
      )}

      {/* Student close button when resolved */}
      {isOwner && isResolved && !canAct && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">This ticket has been resolved</span>
            <span className="text-xs text-muted-foreground">
              If the issue is fixed, you can close this ticket. Otherwise, add a comment to re-open.
            </span>
          </div>
          <Button size="sm" variant="outline" onClick={handleClose} disabled={acting}>
            <XCircleIcon data-icon="inline-start" />
            {acting ? 'Closing…' : 'Close ticket'}
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-6">
        <TicketDetail ticketId={ticketId} />
      </div>

      {canReadInternal ? (
        <Tabs defaultValue="discussion">
          <TabsList>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
            <TabsTrigger value="internal">Internal Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="discussion" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <CommentThread ticketId={ticketId} showInternal={false} />
            </div>
          </TabsContent>
          <TabsContent value="internal" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-4">
                Internal notes are only visible to agents and admins.
              </p>
              <CommentThread ticketId={ticketId} showInternal={true} internalOnly={true} />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Discussion
          </h2>
          <div className="rounded-lg border border-border bg-card p-5">
            <CommentThread ticketId={ticketId} showInternal={false} />
          </div>
        </div>
      )}
    </div>
  )
}
