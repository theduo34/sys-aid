import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ReportsPage } from '@/components/pages/reports/ReportsPage'

export const metadata: Metadata = {
  title: 'Reports',
}

export default async function AdminReportsRoute() {
  const supabase = createClient()
  const { data: profile } = await supabase.from('profiles').select('role').single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  return <ReportsPage />
}
