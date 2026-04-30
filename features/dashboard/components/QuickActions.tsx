import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RequestStaffButton } from '@/features/role-requests/components/RequestStaffButton'

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild>
        <Link href="/tickets/new">New ticket</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/knowledge-base">Browse knowledge base</Link>
      </Button>
      <RequestStaffButton />
    </div>
  )
}
