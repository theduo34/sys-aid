'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { LockSimpleIcon } from '@phosphor-icons/react'

interface CommentFormProps {
  ticketId: string
  onPosted?: () => void
}

const fieldCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none transition-colors'

export function CommentForm({ ticketId, onPosted }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInternal, setIsInternal] = useState(false)
  const canWriteInternal = usePermission('comments:create:internal')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formEl = e.currentTarget
    const body = (new FormData(formEl)).get('body') as string

    try {
      const res  = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: ticketId, body, is_internal: isInternal }),
      })
      let json: Record<string, unknown> = {}
      try { json = await res.json() } catch { /* non-JSON response */ }

      if (!res.ok) {
        toast.error((json.error as string) ?? 'Failed to post comment.')
      } else {
        toast.success(isInternal ? 'Internal note posted.' : 'Comment posted.')
        formEl.reset()
        setIsInternal(false)
        onPosted?.()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        name="body"
        required
        rows={3}
        placeholder={isInternal ? 'Write an internal note (only visible to agents)…' : 'Write a comment…'}
        className={fieldCls}
      />

      <div className="flex items-center justify-between gap-3">
        {canWriteInternal && (
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <div
              role="checkbox"
              aria-checked={isInternal}
              tabIndex={0}
              onClick={() => setIsInternal((v) => !v)}
              onKeyDown={(e) => e.key === 'Enter' && setIsInternal((v) => !v)}
              className={`flex size-4 items-center justify-center rounded border transition-colors ${
                isInternal ? 'bg-warning border-warning/80' : 'border-border bg-background'
              }`}
            >
              {isInternal && <LockSimpleIcon className="size-2.5 text-warning-foreground" />}
            </div>
            <span className={isInternal ? 'text-warning-foreground' : 'text-muted-foreground'}>
              Internal note
            </span>
          </label>
        )}

        <Button type="submit" size="sm" disabled={isSubmitting} className="ms-auto">
          {isSubmitting ? 'Posting…' : isInternal ? 'Post internal note' : 'Post comment'}
        </Button>
      </div>
    </form>
  )
}
