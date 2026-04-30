'use client'

import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface ArticleFormProps {
  onSaved?: () => void
}

export function ArticleForm({ onSaved }: ArticleFormProps) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = form.get('title') as string
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { error } = await supabase.from('knowledge_articles').insert({
      title,
      slug,
      body:      form.get('body') as string,
      published: form.get('published') === 'on',
    })

    if (error) toast.error('Failed to save article.')
    else { toast.success('Article saved.'); onSaved?.() }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="title" required placeholder="Title" className="border border-border bg-background px-3 py-2 text-sm" />
      <textarea name="body" required rows={10} placeholder="Body (markdown)" className="border border-border bg-background px-3 py-2 text-sm font-mono" />
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" name="published" />
        Publish immediately
      </label>
      <Button type="submit" size="sm">Save article</Button>
    </form>
  )
}
