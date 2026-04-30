interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
