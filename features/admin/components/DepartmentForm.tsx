'use client'

import { Button } from '@/components/ui/button'

export function DepartmentForm() {
  return (
    <form className="flex flex-col gap-4">
      <input name="name" required placeholder="Department name" className="border border-border bg-background px-3 py-2 text-sm" />
      <Button type="submit" size="sm">Add department</Button>
    </form>
  )
}
