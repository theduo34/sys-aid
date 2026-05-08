'use client'

import { useState } from 'react'
import { CategoryForm } from '@/features/admin/components/CategoryForm'
import { CategoryList } from '@/features/admin/components/CategoryList'
import { SLASettings } from '@/features/admin/components/SLASettings'
import { useAdminData } from '@/features/admin/hooks/useAdminData'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@phosphor-icons/react'
import { ResponsiveModal } from '@/components/shared/ResponsiveModal'

export function AdminCategoriesPage() {
  const { refetch } = useAdminData()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold text-foreground">Categories</h2>
            <p className="text-xs text-muted-foreground">
              Group tickets by type. Each category can set a default priority and auto-assign to technicians in the same department.
            </p>
          </div>
          <Button size="sm" onClick={() => setOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            Add category
          </Button>
        </div>
        <CategoryList />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">SLA Targets</h2>
        <p className="text-xs text-muted-foreground">
          Response and resolution time targets per priority level.
        </p>
        <SLASettings />
      </section>

      <ResponsiveModal
        open={open}
        onOpenChange={setOpen}
        title="Add Category"
        description="Create a new ticket category with a default priority and optional department."
      >
        <CategoryForm
          onSaved={() => { setOpen(false); refetch() }}
          onCancel={() => setOpen(false)}
        />
      </ResponsiveModal>
    </div>
  )
}
