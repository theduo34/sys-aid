'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useMyRoleRequest } from '../hooks/useMyRoleRequest'

export function RequestStaffButton() {
  const { role } = useAuth()
  const { hasPending, isLoading } = useMyRoleRequest()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Only students can request — all other roles already have their access
  if (role !== 'student') return null
  if (isLoading) return null

  if (hasPending || submitted) {
    return (
      <span className="text-xs text-muted-foreground border border-border px-3 py-1.5">
        Staff request pending admin approval
      </span>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const form = new FormData(e.currentTarget)

    const res = await fetch('/api/role-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: form.get('reason') }),
    })

    const json = await res.json()

    if (!res.ok) {
      toast.error(json.error ?? 'Could not submit request.')
    } else {
      toast.success('Request submitted. An admin will review it shortly.')
      setSubmitted(true)
      setIsOpen(false)
    }

    setIsSubmitting(false)
  }

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        I am a Lecturer / Staff Member
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-border p-4 max-w-md">
      <p className="text-sm font-medium text-foreground">Request Staff Access</p>
      <p className="text-xs text-muted-foreground">
        Provide your staff details. An admin will verify and approve your request. Once approved,
        your tickets will automatically be treated as high priority.
      </p>
      <textarea
        name="reason"
        required
        minLength={10}
        rows={3}
        placeholder="e.g. I am a Computer Science lecturer, staff ID: CS-2024-001"
        className="border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit request'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
