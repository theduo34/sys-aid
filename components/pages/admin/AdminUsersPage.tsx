import { UserTable } from '@/features/admin/components/UserTable'
import { CreateUserForm } from '@/features/admin/components/CreateUserForm'
import { RoleRequestsList } from '@/features/role-requests/components/RoleRequestsList'
import { PageHeader } from '@/components/shared/PageHeader'

export function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Users" />
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground">Staff / Lecturer Requests</h2>
        <p className="text-xs text-muted-foreground">
          Students who have requested staff access. Approve to upgrade their role and ticket priority.
        </p>
        <RoleRequestsList />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground">Create Account</h2>
        <p className="text-xs text-muted-foreground">
          Create a staff or technician account directly. The user receives a temporary password.
        </p>
        <div className="max-w-sm">
          <CreateUserForm />
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground">All Users</h2>
        <UserTable />
      </section>
    </div>
  )
}
