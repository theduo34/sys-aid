'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/Avatar'
import { UserIcon, EnvelopeIcon, IdentificationCardIcon, BuildingOfficeIcon } from '@phosphor-icons/react'

const fieldCls =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors'

const readonlyCls =
  'w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed'

const roleLabels: Record<string, string> = {
  student:    'Student',
  staff:      'Staff / Lecturer',
  technician: 'IT Technician',
  admin:      'Administrator',
}

export function ProfilePage() {
  const { profile, user } = useAuth()
  const [saving, setSaving] = useState(false)

  if (!profile || !user) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const form = new FormData(e.currentTarget)

    const updates = {
      full_name:  (form.get('full_name') as string).trim(),
      department: (form.get('department') as string).trim() || null,
      student_id: (form.get('student_id') as string).trim() || null,
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) toast.error('Failed to save profile.')
    else toast.success('Profile updated.')

    setSaving(false)
  }

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      {/* Header card */}
      <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-5">
        <Avatar
          name={profile.full_name}
          className="size-16 text-xl shrink-0 rounded-xl"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground">{profile.full_name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className="mt-1 inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {roleLabels[profile.role] ?? profile.role}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-5">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <UserIcon className="size-3.5 text-muted-foreground" />
                Full name
              </label>
              <input
                name="full_name"
                required
                defaultValue={profile.full_name}
                placeholder="Your full name"
                className={fieldCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <EnvelopeIcon className="size-3.5 text-muted-foreground" />
                Email
              </label>
              <input
                value={user.email ?? ''}
                readOnly
                className={readonlyCls}
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <BuildingOfficeIcon className="size-3.5 text-muted-foreground" />
                Department
              </label>
              <input
                name="department"
                defaultValue={profile.department ?? ''}
                placeholder="e.g. Computer Science"
                className={fieldCls}
              />
            </div>

            {profile.role === 'student' && (
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <IdentificationCardIcon className="size-3.5 text-muted-foreground" />
                  Student ID
                </label>
                <input
                  name="student_id"
                  defaultValue={profile.student_id ?? ''}
                  placeholder="e.g. KTU/CS/2024/001"
                  className={fieldCls}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                Role
              </label>
              <input
                value={roleLabels[profile.role] ?? profile.role}
                readOnly
                className={readonlyCls}
              />
              <p className="text-xs text-muted-foreground">
                {profile.role === 'student'
                  ? 'Request staff access from the Dashboard if you are a lecturer.'
                  : 'Role is managed by an administrator.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-border">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
