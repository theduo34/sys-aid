import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AgentQueuePage } from '@/components/pages/agent/AgentQueuePage'

export const metadata: Metadata = {
  title: 'Ticket Queue',
}

export default async function AgentQueueRoute() {
  const supabase = createClient()
  const { data: profile } = await supabase.from('profiles').select('role').single()
  if (!profile || !['technician', 'admin'].includes(profile.role)) redirect('/dashboard')

  return <AgentQueuePage />
}
