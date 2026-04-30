'use client'

import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ROLES } from '@/lib/constants'
import type { Profile } from '@/types/types_db'

interface UserFormProps {
  user: Profile
  onSaved?: () => void
}

export function UserForm({ user, onSaved }: UserFormProps) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const { error } = await supabase
      .from('profiles')
      .update({ role: form.get('role') as string, department: form.get('department') as string })
      .eq('id', user.id)

    if (error) toast.error('Failed to update user.')
    else { toast.success('User updated.'); onSaved?.() }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <select name="role" defaultValue={user.role} className="border border-border bg-background px-2 py-1 text-sm">
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <input name="department" defaultValue={user.department ?? ''} placeholder="Department" className="border border-border bg-background px-3 py-2 text-sm" />
      <Button type="submit" size="sm">Save</Button>
    </form>
  )
}
