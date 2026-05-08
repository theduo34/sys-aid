'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ROLES } from '@/lib/constants'
import type { Profile } from '@/types/types_db'

const fieldCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring'

interface UserFormProps {
  user: Profile
  onSaved?: () => void
}

export function UserForm({ user, onSaved }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const form = new FormData(e.currentTarget)

    try {
      const res  = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId:     user.id,
          role:       form.get('role') as string,
          department: (form.get('department') as string) || undefined,
          full_name:  (form.get('full_name') as string) || undefined,
        }),
      })
      let json: Record<string, unknown> = {}
      try { json = await res.json() } catch { /* non-JSON response */ }

      if (!res.ok) {
        toast.error((json.error as string) ?? 'Failed to update user.')
      } else {
        toast.success('User updated.')
        onSaved?.()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Full name</label>
        <input
          name="full_name"
          defaultValue={user.full_name}
          placeholder="Full name"
          className={fieldCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Role</label>
        <select name="role" defaultValue={user.role} className={fieldCls}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Department</label>
        <input
          name="department"
          defaultValue={user.department ?? ''}
          placeholder="e.g. IT, Computer Science"
          className={fieldCls}
        />
      </div>

      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
