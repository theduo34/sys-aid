'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const fieldCls =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors'

const readonlyCls =
  'w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed'

export function ProfileForm({ onSaved }: { onSaved?: () => void }) {
  const { profile, user } = useAuth()
  const [saving, setSaving] = useState(false)

  if (!profile || !user) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const formEl = e.currentTarget
    const form   = new FormData(formEl)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name:  (form.get('full_name') as string).trim(),
          department: (form.get('department') as string).trim() || null,
          student_id: (form.get('student_id') as string | null)?.trim() || null,
        })
        .eq('id', user.id)

      if (error) toast.error(error.message)
      else { toast.success('Profile updated.'); onSaved?.() }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Full name</label>
        <input name="full_name" required defaultValue={profile.full_name} className={fieldCls} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Email</label>
        <input value={user.email ?? ''} readOnly className={readonlyCls} />
        <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Department</label>
        <input name="department" defaultValue={profile.department ?? ''} placeholder="e.g. Computer Science" className={fieldCls} />
      </div>

      {profile.role === 'student' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Student ID</label>
          <input name="student_id" defaultValue={profile.student_id ?? ''} placeholder="e.g. KTU/CS/2024/001" className={fieldCls} />
        </div>
      )}

      <div className="flex items-center gap-3 pt-1 border-t border-border">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
