import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDepartmentsPage } from '@/components/pages/admin/AdminDepartmentsPage'

export const metadata: Metadata = {
  title: 'Departments',
}

export default async function AdminDepartmentsRoute() {
  const supabase = createClient()
  const { data: profile } = await supabase.from('profiles').select('role').single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  return <AdminDepartmentsPage />
}
