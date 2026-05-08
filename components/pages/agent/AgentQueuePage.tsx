import { AgentQueue } from '@/features/agent/components/AgentQueue'

export function AgentQueuePage() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Active tickets sorted by SLA deadline. Overdue tickets are highlighted.
      </p>
      <AgentQueue />
    </div>
  )
}
