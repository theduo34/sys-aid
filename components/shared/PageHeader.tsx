import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageHeaderAction {
  label: string
  href: string
}

interface PageHeaderProps {
  title: string
  description?: string
  action?: PageHeaderAction
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Button asChild size="sm" className="shrink-0">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
