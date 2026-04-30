'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { usePermission } from '@/features/auth/hooks/usePermission'

interface CommentFormProps {
  ticketId: string
}

export function CommentForm({ ticketId }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canWriteInternal = usePermission('comments:create:internal')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const form = new FormData(e.currentTarget)

    const { error } = await supabase.from('comments').insert({
      ticket_id:   ticketId,
      body:        form.get('body') as string,
      is_internal: form.get('is_internal') === 'on',
    })

    if (error) {
      toast.error('Failed to post comment.')
    } else {
      toast.success('Comment posted.')
      e.currentTarget.reset()
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea name="body" required rows={3} placeholder="Write a comment…" className="border border-border bg-background px-3 py-2 text-sm text-foreground" />
      {canWriteInternal && (
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" name="is_internal" />
          Mark as internal note
        </label>
      )}
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? 'Posting…' : 'Post comment'}
      </Button>
    </form>
  )
}
