'use client'

import { useTicket } from '@/features/tickets/hooks/useTicket'
import { TicketDetail } from '@/features/tickets/components/TicketDetail'
import { TicketStatusSelect } from '@/features/tickets/components/TicketStatusSelect'
import { AssignTicketSelect } from './AssignTicketSelect'
import { CommentThread } from '@/features/comments/components/CommentThread'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { resolveTicket } from '@/features/tickets/actions/ticketActions'
import { toast } from 'sonner'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircleIcon } from '@phosphor-icons/react'

interface AgentTicketDetailProps {
  ticketId: string
}

export function AgentTicketDetail({ ticketId }: AgentTicketDetailProps) {
  const { ticket, isLoading } = useTicket(ticketId)
  const canAssignAny = usePermission('tickets:assign:any')
  const [resolving, setResolving] = useState(false)

  if (isLoading) return <LoadingSpinner />
  if (!ticket) return <p className="text-sm text-muted-foreground">Ticket not found.</p>

  async function handleResolve() {
    setResolving(true)
    try {
      const { error } = await resolveTicket(ticketId)
      if (error) toast.error('Failed to resolve ticket.')
      else toast.success('Ticket marked as resolved.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setResolving(false)
    }
  }

  const isActive = !['resolved', 'closed'].includes(ticket.status)

  return (
    <div className="flex flex-col gap-4">
      {/* Controls bar */}
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

        {isActive && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleResolve}
            disabled={resolving}
            className="ms-auto"
          >
            <CheckCircleIcon data-icon="inline-start" />
            {resolving ? 'Resolving…' : 'Mark resolved'}
          </Button>
        )}
      </div>

      <Tabs defaultValue="details">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="internal">Internal Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <TicketDetail ticketId={ticketId} />
          </div>
        </TabsContent>

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
    </div>
  )
}
