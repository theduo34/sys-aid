import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminUsersPage } from '@/components/pages/admin/AdminUsersPage'

export const metadata: Metadata = {
  title: 'Users',
}

export default async function AdminUsersRoute() {
  const supabase = createClient()
  const { data: profile } = await supabase.from('profiles').select('role').single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  return <AdminUsersPage />
}
