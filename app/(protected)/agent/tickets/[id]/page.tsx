import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AgentTicketDetail } from '@/features/agent/components/AgentTicketDetail'

export const metadata: Metadata = {
  title: 'Ticket',
}

export default async function AgentTicketRoute({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: profile } = await supabase.from('profiles').select('role').single()
  if (!profile || !['technician', 'admin'].includes(profile.role)) redirect('/dashboard')

  return <AgentTicketDetail ticketId={params.id} />
}
