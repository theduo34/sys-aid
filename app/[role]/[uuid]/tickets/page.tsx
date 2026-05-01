import type { Metadata } from 'next'
import { TicketsPage } from '@/components/pages/ticket/TicketsPage'

export const metadata: Metadata = { title: 'My Tickets' }

export default function TicketsRoute() {
  return <TicketsPage />
}
