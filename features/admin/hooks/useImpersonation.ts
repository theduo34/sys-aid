'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function useImpersonation() {
  const [isImpersonating, setIsImpersonating] = useState(false)

  async function startImpersonation(targetUserId: string, reason?: string) {
    const res = await fetch('/api/admin/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, reason }),
    })
    if (!res.ok) {
      toast.error('Could not start impersonation.')
      return
    }
    setIsImpersonating(true)
    toast.success('Now viewing as another user.')
  }

  async function stopImpersonation() {
    await fetch('/api/admin/impersonate', { method: 'DELETE' })
    setIsImpersonating(false)
    window.location.reload()
  }

  return { isImpersonating, startImpersonation, stopImpersonation }
}
