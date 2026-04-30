import { SpinnerIcon } from '@phosphor-icons/react/dist/ssr'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <SpinnerIcon className="size-5 animate-spin text-muted-foreground" />
    </div>
  )
}
