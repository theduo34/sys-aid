import type { Metadata } from 'next'
import { AgentQueuePage } from '@/components/pages/agent/AgentQueuePage'

export const metadata: Metadata = { title: 'Ticket Queue' }

export default function QueueRoute() {
  return <AgentQueuePage />
}
