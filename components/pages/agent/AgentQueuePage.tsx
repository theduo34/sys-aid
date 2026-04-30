import { AgentQueue } from '@/features/agent/components/AgentQueue'
import { PageHeader } from '@/components/shared/PageHeader'

export function AgentQueuePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Ticket Queue" />
      <AgentQueue />
    </div>
  )
}
