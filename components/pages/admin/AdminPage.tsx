import { UserTable } from '@/features/admin/components/UserTable'
import { ImpersonatePicker } from '@/features/admin/components/ImpersonatePicker'
import { PageHeader } from '@/components/shared/PageHeader'

export function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Admin" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-foreground">Users</h2>
          <UserTable />
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-foreground">Impersonate User</h2>
          <ImpersonatePicker />
        </section>
      </div>
    </div>
  )
}
