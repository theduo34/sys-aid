'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { PRIORITIES } from '@/lib/constants'
import type { Category } from '@/types/types_db'

const fieldCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring'

interface CategoryFormProps {
  existing?: Category
  onSaved?: () => void
  onCancel?: () => void
}

export function CategoryForm({ existing, onSaved, onCancel }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!existing

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formEl = e.currentTarget
    const form   = new FormData(formEl)

    const payload = {
      name:             form.get('name') as string,
      department:       (form.get('department') as string) || null,
      default_priority: form.get('default_priority') as string,
    }

    const url    = isEdit ? `/api/categories/${existing.id}` : '/api/categories'
    const method = isEdit ? 'PATCH' : 'POST'

    try {
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      let json: Record<string, unknown> = {}
      try { json = await res.json() } catch { /* non-JSON response */ }

      if (!res.ok) {
        toast.error((json.error as string) ?? 'Failed to save category.')
      } else {
        toast.success(isEdit ? 'Category updated.' : 'Category created.')
        onSaved?.()
        if (!isEdit) formEl.reset()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Name *</label>
        <input
          name="name"
          required
          defaultValue={existing?.name}
          placeholder="e.g. Network & Connectivity"
          className={fieldCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Department</label>
        <input
          name="department"
          defaultValue={existing?.department ?? ''}
          placeholder="Optional — e.g. IT"
          className={fieldCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Default priority</label>
        <select name="default_priority" defaultValue={existing?.default_priority ?? 'medium'} className={fieldCls}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Auto-applied when this category is selected on a new ticket.
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEdit ? 'Update category' : 'Add category'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
