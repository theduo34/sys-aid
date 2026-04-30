'use client'

import { useAdminData } from '../hooks/useAdminData'
import { useImpersonation } from '../hooks/useImpersonation'
import { Button } from '@/components/ui/button'

export function ImpersonatePicker() {
  const { users } = useAdminData()
  const { startImpersonation } = useImpersonation()

  // Admins cannot impersonate other admins
  const targets = users.filter((u) => u.role !== 'admin')

  return (
    <div className="flex flex-col gap-3">
      {targets.map((u) => (
        <div key={u.id} className="flex items-center justify-between gap-4">
          <span className="text-sm text-foreground">{u.full_name} <span className="text-muted-foreground">({u.role})</span></span>
          <Button size="sm" variant="outline" onClick={() => startImpersonation(u.id)}>
            Impersonate
          </Button>
        </div>
      ))}
    </div>
  )
}
