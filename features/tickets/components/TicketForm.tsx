'use client'

import { useCreateTicket } from '../hooks/useCreateTicket'
import { Button } from '@/components/ui/button'

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="title" type="text" placeholder="Title" required className="border border-border bg-background px-3 py-2 text-sm" />
      <textarea name="description" placeholder="Describe the issue" required rows={5} className="border border-border bg-background px-3 py-2 text-sm" />
      {/* category_id select populated from DB — placeholder for now */}
      <input name="category_id" type="hidden" value="" />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Submit ticket'}
      </Button>
    </form>
  )
}
