import { CategoryForm } from '@/features/admin/components/CategoryForm'
import { SLASettings } from '@/features/admin/components/SLASettings'

export function AdminCategoriesPage() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Add Category</h2>
        <CategoryForm />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">SLA Targets</h2>
        <SLASettings />
      </section>
    </div>
  )
}
