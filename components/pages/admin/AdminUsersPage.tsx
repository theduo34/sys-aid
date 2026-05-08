'use client'

import { useState } from 'react'
import { UserTable } from '@/features/admin/components/UserTable'
import { CreateUserForm } from '@/features/admin/components/CreateUserForm'
import { RoleRequestsList } from '@/features/role-requests/components/RoleRequestsList'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/shared/ResponsiveModal'
import { UserPlusIcon } from '@phosphor-icons/react'

export function AdminUsersPage() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Staff / Lecturer Requests</h2>
        <p className="text-xs text-muted-foreground">
          Students who requested staff access. Approve to upgrade their role and ticket priority.
        </p>
        <RoleRequestsList />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold text-foreground">All Users</h2>
            <p className="text-xs text-muted-foreground">
              Click the pencil to edit a user&apos;s role or department. Click the user icon to impersonate.
            </p>
          </div>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <UserPlusIcon data-icon="inline-start" />
            Create account
          </Button>
        </div>
        <UserTable />
      </section>

      <ResponsiveModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Account"
        description="Create a staff or technician account. The user will receive a temporary password."
      >
        <div className="py-2">
          <CreateUserForm />
        </div>
      </ResponsiveModal>
    </div>
  )
}
