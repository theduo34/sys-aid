import { DepartmentForm } from '@/features/admin/components/DepartmentForm'
import { PageHeader } from '@/components/shared/PageHeader'

export function AdminDepartmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Departments" />
      <div className="max-w-sm">
        <DepartmentForm />
      </div>
    </div>
  )
}
