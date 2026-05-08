'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const fieldCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring'

interface ArticleFormProps {
  onSaved?: () => void
}

export function ArticleForm({ onSaved }: ArticleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const form = new FormData(e.currentTarget)
    const title = form.get('title') as string
    const slug  = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    try {
      const { error } = await supabase.from('knowledge_articles').insert({
        title,
        slug,
        body:      form.get('body') as string,
        published: form.get('published') === 'on',
      })

      if (error) {
        toast.error(error.message ?? 'Failed to save article.')
      } else {
        toast.success('Article saved.')
        onSaved?.()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Title *</label>
        <input name="title" required placeholder="e.g. How to connect to University VPN" className={fieldCls} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Body (Markdown) *</label>
        <textarea
          name="body"
          required
          rows={10}
          placeholder="Write the article content in Markdown…"
          className={fieldCls + ' font-mono resize-y'}
        />
      </div>

      <label className="flex items-center gap-2 text-xs cursor-pointer text-muted-foreground select-none">
        <input type="checkbox" name="published" className="rounded" />
        Publish immediately (visible to all users)
      </label>

      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save article'}
      </Button>
    </form>
  )
}
