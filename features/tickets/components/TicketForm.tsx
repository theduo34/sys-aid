'use client'

import { useCreateTicket } from '../hooks/useCreateTicket'
import { Button } from '@/components/ui/button'

const fieldClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors'

const labelClass = 'text-sm font-medium text-foreground'

export function TicketForm() {
  const { submit, isSubmitting } = useCreateTicket()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await submit({
      title:       form.get('title') as string,
      description: form.get('description') as string,
      category_id: form.get('category_id') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelClass}>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Brief description of the issue"
          required
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe the issue in detail — what happened, when it started, what you've already tried."
          required
          rows={6}
          className={fieldClass + ' resize-none'}
        />
      </div>

      <input name="category_id" type="hidden" value="" />

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? 'Submitting…' : 'Submit ticket'}
      </Button>
    </form>
  )
}
