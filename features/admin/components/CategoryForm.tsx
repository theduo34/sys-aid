'use client'

import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { PRIORITIES } from '@/lib/constants'

interface CategoryFormProps {
  onSaved?: () => void
}

export function CategoryForm({ onSaved }: CategoryFormProps) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const { error } = await supabase.from('categories').insert({
      name:             form.get('name') as string,
      department:       form.get('department') as string || null,
      default_priority: form.get('default_priority') as string,
    })

    if (error) toast.error('Failed to create category.')
    else { toast.success('Category created.'); onSaved?.(); e.currentTarget.reset() }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="name" required placeholder="Category name" className="border border-border bg-background px-3 py-2 text-sm" />
      <input name="department" placeholder="Department (optional)" className="border border-border bg-background px-3 py-2 text-sm" />
      <select name="default_priority" defaultValue="medium" className="border border-border bg-background px-2 py-1 text-sm">
        {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <Button type="submit" size="sm">Add category</Button>
    </form>
  )
}
