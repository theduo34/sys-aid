'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { useRoleRequests } from '../hooks/useRoleRequests'

export function RoleRequestsList() {
  const { requests, isLoading, setRequests } = useRoleRequests()
  const [reviewingId, setReviewingId] = useState<string | null>(null)

  async function review(id: string, status: 'approved' | 'rejected') {
    setReviewingId(id)
    const res = await fetch(`/api/role-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      toast.error('Failed to update request.')
    } else {
      toast.success(status === 'approved' ? 'User promoted to staff.' : 'Request rejected.')
      setRequests((prev) => prev.filter((r) => r.id !== id))
    }
    setReviewingId(null)
  }

  if (isLoading) return <LoadingSpinner />
  if (!requests.length) return <EmptyState message="No pending role requests." />

  return (
    <div className="flex flex-col gap-3">
      {requests.map((r) => (
        <div key={r.id} className="flex flex-col gap-2 border border-border p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{r.user.full_name}</span>
              <span className="text-xs text-muted-foreground">
                {r.user.department ?? 'No department'} · requesting staff status
              </span>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(r.created_at).toLocaleDateString()}
            </span>
          </div>
          {r.reason && (
            <p className="text-sm text-foreground">{r.reason}</p>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => review(r.id, 'approved')}
              disabled={reviewingId === r.id}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => review(r.id, 'rejected')}
              disabled={reviewingId === r.id}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
