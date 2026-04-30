import { CategoryForm } from '@/features/admin/components/CategoryForm'
import { SLASettings } from '@/features/admin/components/SLASettings'
import { PageHeader } from '@/components/shared/PageHeader'

export function AdminCategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Categories &amp; SLA" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-foreground">Add Category</h2>
          <CategoryForm />
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-foreground">SLA Targets</h2>
          <SLASettings />
        </section>
      </div>
    </div>
  )
}
