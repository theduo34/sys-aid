'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { KnowledgeArticle } from '@/types/types_db'

const fieldCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring'

interface ArticleFormProps {
  article?: KnowledgeArticle
  onSaved?: () => void
}

export function ArticleForm({ article, onSaved }: ArticleFormProps) {
  const isEdit = !!article
  const [title,     setTitle]     = useState(article?.title     ?? '')
  const [body,      setBody]      = useState(article?.body      ?? '')
  const [published, setPublished] = useState(article?.published ?? false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = isEdit
        ? await fetch(`/api/knowledge-base/${article.id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ title, body, published }),
          })
        : await fetch('/api/knowledge-base', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ title, body, published }),
          })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error ?? 'Failed to save article.')
      } else {
        toast.success(isEdit ? 'Article updated.' : 'Article created.')
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
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. How to connect to University VPN"
          className={fieldCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Body (Markdown) *</label>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          placeholder="Write the article content in Markdown…"
          className={fieldCls + ' font-mono resize-y'}
        />
      </div>

      <label className="flex items-center gap-2 text-xs cursor-pointer text-muted-foreground select-none">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="rounded"
        />
        Publish (visible to all users — will notify everyone on the platform)
      </label>

      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : isEdit ? 'Update article' : 'Create article'}
      </Button>
    </form>
  )
}
