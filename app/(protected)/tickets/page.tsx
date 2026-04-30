import type { Metadata } from 'next'
import { TicketsPage } from '@/components/pages/ticket/TicketsPage'

export const metadata: Metadata = {
  title: 'My Tickets',
  description: 'View and manage your IT support tickets',
}

export default function TicketsRoute() {
  return <TicketsPage />
}
