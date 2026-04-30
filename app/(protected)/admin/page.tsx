import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminPage } from '@/components/pages/admin/AdminPage'

export const metadata: Metadata = {
  title: 'Admin',
}

export default async function AdminRoute() {
  const supabase = createClient()
  const { data: profile } = await supabase.from('profiles').select('role').single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  return <AdminPage />
}
