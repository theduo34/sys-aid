'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useAdminData } from '../hooks/useAdminData'
import { CategoryForm } from './CategoryForm'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { ResponsiveModal } from '@/components/shared/ResponsiveModal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import type { Category } from '@/types/types_db'
import type { Priority } from '@/lib/constants'

export function CategoryList() {
  const { categories, isLoading, refetch } = useAdminData()
  const [editCat,   setEditCat]   = useState<Category | null>(null)
  const [deleteCat, setDeleteCat] = useState<Category | null>(null)
  const [deleting,  setDeleting]  = useState(false)

  async function handleDelete() {
    if (!deleteCat) return
    setDeleting(true)
    const res = await fetch(`/api/categories/${deleteCat.id}`, { method: 'DELETE' })
    if (!res.ok) toast.error('Failed to delete category.')
    else { toast.success('Category deleted.'); refetch() }
    setDeleteCat(null)
    setDeleting(false)
  }

  if (isLoading) return <LoadingSpinner />
  if (!categories.length) return <EmptyState message="No categories yet." description="Add a category above." />

  return (
    <>
      <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between gap-3 border-b border-border last:border-0 px-4 py-3 hover:bg-muted/30 transition-colors">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground truncate">{cat.name}</span>
              {cat.department && (
                <span className="text-xs text-muted-foreground">{cat.department}</span>
              )}
            </div>
            <PriorityBadge priority={cat.default_priority as Priority} />
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => setEditCat(cat)}
              >
                <PencilSimpleIcon className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteCat(cat)}
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ResponsiveModal
        open={!!editCat}
        onOpenChange={(open) => { if (!open) setEditCat(null) }}
        title={`Edit — ${editCat?.name ?? ''}`}
      >
        {editCat && (
          <CategoryForm
            existing={editCat}
            onSaved={() => { setEditCat(null); refetch() }}
            onCancel={() => setEditCat(null)}
          />
        )}
      </ResponsiveModal>

      <ConfirmDialog
        open={!!deleteCat}
        title={`Delete "${deleteCat?.name}"?`}
        description="Any tickets in this category will have their category cleared. This cannot be undone."
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteCat(null)}
      />
    </>
  )
}
