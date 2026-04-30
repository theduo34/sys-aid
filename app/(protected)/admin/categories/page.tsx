import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminCategoriesPage } from '@/components/pages/admin/AdminCategoriesPage'

export const metadata: Metadata = {
  title: 'Categories',
}

export default async function AdminCategoriesRoute() {
  const supabase = createClient()
  const { data: profile } = await supabase.from('profiles').select('role').single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  return <AdminCategoriesPage />
}
