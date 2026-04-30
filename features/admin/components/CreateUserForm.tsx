'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type CreatableRole = 'technician' | 'staff'

const roleLabels: Record<CreatableRole, string> = {
  technician: 'Technician',
  staff: 'Staff / Lecturer',
}

const roleDescriptions: Record<CreatableRole, string> = {
  technician: 'Can manage the ticket queue, update statuses, and write internal notes.',
  staff: 'Same as a student account but tickets are automatically treated as high priority.',
}

export function CreateUserForm() {
  const [selectedRole, setSelectedRole] = useState<CreatableRole>('technician')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tempPassword, setTempPassword] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setTempPassword(null)
    const form = new FormData(e.currentTarget)

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        full_name: form.get('full_name'),
        role: selectedRole,
      }),
    })

    const json = await res.json()

    if (!res.ok) {
      toast.error(json.error ?? 'Failed to create account.')
    } else {
      setTempPassword(json.data.tempPassword)
      toast.success(`${roleLabels[selectedRole]} account created.`)
      e.currentTarget.reset()
    }

    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(Object.keys(roleLabels) as CreatableRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => { setSelectedRole(r); setTempPassword(null) }}
            className={`px-3 py-1.5 text-xs border transition-colors ${
              selectedRole === r
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:text-foreground'
            }`}
          >
            {roleLabels[r]}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{roleDescriptions[selectedRole]}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="full_name"
          required
          placeholder="Full name"
          className="border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
        <input
          name="email"
          type="email"
          required
          placeholder={selectedRole === 'technician' ? 'Work email' : 'University email'}
          className="border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : `Create ${roleLabels[selectedRole]} account`}
        </Button>
      </form>
      {tempPassword && (
        <div className="border border-border bg-muted p-3">
          <p className="text-xs text-muted-foreground">
            Share this temporary password with the user. They should change it on first login.
          </p>
          <code className="mt-1 block text-sm font-mono text-foreground select-all">{tempPassword}</code>
        </div>
      )}
    </div>
  )
}
