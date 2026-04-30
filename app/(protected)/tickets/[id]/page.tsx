import type { Metadata } from 'next'
import { TicketDetailPage } from '@/components/pages/ticket/TicketDetailPage'

export const metadata: Metadata = {
  title: 'Ticket',
}

export default function TicketDetailRoute({ params }: { params: { id: string } }) {
  return <TicketDetailPage ticketId={params.id} />
}
