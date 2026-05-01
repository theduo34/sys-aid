import type { Metadata } from 'next'
import { AdminDepartmentsPage } from '@/components/pages/admin/AdminDepartmentsPage'

export const metadata: Metadata = { title: 'Departments' }

export default function DepartmentsRoute() {
  return <AdminDepartmentsPage />
}
