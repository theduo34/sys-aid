'use client'

import Link from 'next/link'
import { PlusIcon } from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useBasePath } from '@/hooks/useBasePath'
import { Button } from '@/components/ui/button'
import { RequestStaffButton } from '@/features/role-requests/components/RequestStaffButton'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardGreeting() {
  const { profile, role } = useAuth()
  const base = useBasePath()
  const firstName = profile?.full_name?.split(' ')[0] ?? ''

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">
          {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your IT tickets today.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(role === 'student' || role === 'staff' || role === 'admin') && (
          <Button asChild size="sm">
            <Link href={`${base}/tickets/new`}>
              <PlusIcon className="size-4 mr-1.5" />
              New Ticket
            </Link>
          </Button>
        )}
        <RequestStaffButton />
      </div>
    </div>
  )
}
