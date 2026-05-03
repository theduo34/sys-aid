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
    <div className="rounded-lg border border-border bg-card px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {getGreeting()}
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          {firstName || 'Welcome back'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s your IT support summary for today.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {(role === 'student' || role === 'staff' || role === 'admin') && (
          <Button asChild size="sm">
            <Link href={`${base}/tickets/new`}>
              <PlusIcon data-icon="inline-start" />
              New Ticket
            </Link>
          </Button>
        )}
        <RequestStaffButton />
      </div>
    </div>
  )
}
