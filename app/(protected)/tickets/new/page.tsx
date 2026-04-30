import type { Metadata } from 'next'
import { TicketNewPage } from '@/components/pages/ticket/TicketNewPage'

export const metadata: Metadata = {
  title: 'New Ticket',
  description: 'Submit a new IT support ticket',
}

export default function NewTicketRoute() {
  return <TicketNewPage />
}
