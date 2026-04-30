'use client'

import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  isOpen: boolean
}

export function ConfirmDialog({ title, description, onConfirm, onCancel, isOpen }: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col gap-4 border border-border bg-background p-6">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  )
}
