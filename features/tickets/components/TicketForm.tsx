'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useBasePath } from '@/hooks/useBasePath'
import { useCategories } from '../hooks/useCategories'
import { createTicket } from '../actions/ticketActions'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/builders/FileUpload'
import { PRIORITIES } from '@/lib/constants'
import type { Priority } from '@/lib/constants'

const fieldCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors'

const labelCls = 'text-sm font-medium text-foreground'

const priorityLabels: Record<Priority, string> = {
  critical: 'P1 — Critical',
  high:     'P2 — High',
  medium:   'P3 — Medium',
  low:      'P4 — Low',
}

const roleDefaultPriority: Record<string, Priority> = {
  student:    'medium',
  staff:      'high',
  technician: 'medium',
  admin:      'medium',
}


export function TicketForm() {
  const { role } = useAuth()
  const base = useBasePath()
  const router = useRouter()
  const { categories, isLoading: catsLoading } = useCategories()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [priority, setPriority] = useState<Priority>(
    roleDefaultPriority[role ?? 'student'] ?? 'medium'
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!role) return
    setIsSubmitting(true)

    const form = new FormData(e.currentTarget)
    const categoryId = form.get('category_id') as string | null

    try {
      // Upload attachment first (if any) so the URL goes into the initial INSERT —
      // students can't do a separate UPDATE due to RLS.
      let attachmentUrl: string | null = null
      if (attachment) {
        const ext  = attachment.name.split('.').pop()
        const path = `tickets/${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('attachments').upload(path, attachment)
        if (uploadErr) {
          toast.error('Failed to upload attachment.')
          return
        }
        attachmentUrl = supabase.storage.from('attachments').getPublicUrl(path).data.publicUrl
      }

      const { data: ticket, error } = await createTicket(
        {
          title:          form.get('title') as string,
          description:    form.get('description') as string,
          category_id:    categoryId || null,
          priority,
          attachment_url: attachmentUrl,
        },
        role
      )

      if (error || !ticket) {
        toast.error(typeof error === 'object' && 'message' in error ? error.message : 'Failed to submit ticket.')
        return
      }

      toast.success('Ticket submitted successfully.')
      router.push(`${base}/tickets/${ticket.id}`)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelCls}>
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Brief description of the issue"
          required
          minLength={5}
          className={fieldCls}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category_id" className={labelCls}>Category</label>
          <select
            id="category_id"
            name="category_id"
            className={fieldCls}
            disabled={catsLoading}
          >
            <option value="">— Select category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={fieldCls}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{priorityLabels[p]}</option>
            ))}
          </select>
          {role === 'staff' && (
            <p className="text-xs text-muted-foreground">Staff tickets default to High priority.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={labelCls}>
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe the issue — what happened, when it started, and what you have already tried."
          required
          minLength={10}
          rows={6}
          className={fieldCls + ' resize-none'}
        />
      </div>

      <FileUpload
        name="attachment"
        label="Attachment (optional)"
        accept="image/*,.pdf,.doc,.docx,.txt,.zip"
        onFileSelect={setAttachment}
      />

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit ticket'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`${base}/tickets`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
