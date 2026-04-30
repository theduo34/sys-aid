import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageHeaderAction {
  label: string
  href: string
}

interface PageHeaderProps {
  title: string
  action?: PageHeaderAction
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      {action && (
        <Button asChild size="sm">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
