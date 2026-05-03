import type { Metadata } from 'next'
import { TicketDetailPage } from '@/components/pages/ticket/TicketDetailPage'

export const metadata: Metadata = { title: 'Ticket' }

export default async function TicketDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TicketDetailPage ticketId={id} />
}
