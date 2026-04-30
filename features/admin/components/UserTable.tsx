'use client'

import { useAdminData } from '../hooks/useAdminData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export function UserTable() {
  const { users, isLoading } = useAdminData()

  if (isLoading) return <LoadingSpinner />

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs text-muted-foreground">
          <th className="pb-2 font-medium">Name</th>
          <th className="pb-2 font-medium">Role</th>
          <th className="pb-2 font-medium">Department</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b border-border">
            <td className="py-2 text-foreground">{u.full_name}</td>
            <td className="py-2 text-muted-foreground capitalize">{u.role}</td>
            <td className="py-2 text-muted-foreground">{u.department ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
