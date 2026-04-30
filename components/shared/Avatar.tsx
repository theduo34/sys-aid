import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  className?: string
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <span className={cn('inline-flex size-8 items-center justify-center bg-muted text-xs font-medium text-muted-foreground', className)}>
      {getInitials(name)}
    </span>
  )
}
