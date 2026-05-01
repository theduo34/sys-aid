import type { Metadata } from 'next'
import { TicketNewPage } from '@/components/pages/ticket/TicketNewPage'

export const metadata: Metadata = { title: 'New Ticket' }

export default function NewTicketRoute() {
  return <TicketNewPage />
}
