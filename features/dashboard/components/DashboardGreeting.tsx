'use client'

import Link from 'next/link'
import { PlusIcon, HeadsetIcon } from '@phosphor-icons/react'
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

const roleMessages: Record<string, string> = {
  student:    'How can we help you today?',
  staff:      'Your tickets are treated as high priority.',
  technician: 'Check your queue for assigned tickets.',
  admin:      'Full system access is enabled.',
}

export function DashboardGreeting() {
  const { profile, role } = useAuth()
  const base = useBasePath()
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,var(--foreground) 0,var(--foreground) 1px,transparent 1px,transparent 40px),' +
            'repeating-linear-gradient(90deg,var(--foreground) 0,var(--foreground) 1px,transparent 1px,transparent 40px)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-foreground/5 blur-3xl" />

      <div className="relative flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground shadow-sm">
            <HeadsetIcon className="size-6 text-background" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {getGreeting()}
            </p>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {firstName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {role ? roleMessages[role] : ''}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {role && ['student', 'staff', 'technician', 'admin'].includes(role) && (
            <Button asChild>
              <Link href={`${base}/tickets/new`}>
                <PlusIcon data-icon="inline-start" />
                New Ticket
              </Link>
            </Button>
          )}
          <RequestStaffButton />
        </div>
      </div>
    </div>
  )
}
