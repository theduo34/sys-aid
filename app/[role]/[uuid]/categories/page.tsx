import type { Metadata } from 'next'
import { AdminCategoriesPage } from '@/components/pages/admin/AdminCategoriesPage'

export const metadata: Metadata = { title: 'Categories' }

export default function CategoriesRoute() {
  return <AdminCategoriesPage />
}
