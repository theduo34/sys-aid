import type { Metadata } from 'next'
import { AdminUsersPage } from '@/components/pages/admin/AdminUsersPage'

export const metadata: Metadata = { title: 'Users' }

export default function UsersRoute() {
  return <AdminUsersPage />
}
