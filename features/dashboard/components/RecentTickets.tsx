'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { useTickets } from '@/features/tickets/hooks/useTickets'
import { useBasePath } from '@/hooks/useBasePath'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'
import type { TicketStatus } from '@/lib/constants'

const statusDot: Record<TicketStatus, string> = {
  open:        'bg-foreground',
  assigned:    'bg-foreground/50',
  in_progress: 'bg-foreground',
  pending:     'bg-warning',
  resolved:    'bg-muted-foreground',
  closed:      'bg-muted-foreground',
}

export function RecentTickets() {
  const { tickets, isLoading } = useTickets()
  const base = useBasePath()
  const recent = tickets.slice(0, 6)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Recent Tickets</span>
        {base && (
          <Link
            href={`${base}/tickets`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <ArrowRightIcon className="size-3" />
          </Link>
        )}
      </div>

      {isLoading && <LoadingSpinner />}

      {!isLoading && !recent.length && (
        <EmptyState message="No tickets yet." description="Submit your first IT support ticket to get started." />
      )}

      {!isLoading && recent.length > 0 && (
        <div className="flex flex-col">
          {recent.map((t) => (
            <Link
              key={t.id}
              href={`${base}/tickets/${t.id}`}
              className="group flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted/50 transition-colors -mx-3"
            >
              <div className={cn('size-1.5 shrink-0 rounded-full', statusDot[t.status])} />

              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="truncate text-sm text-foreground">{t.title}</span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>
                    {new Date(t.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  {(t as { category?: { name: string } | null }).category?.name && (
                    <>
                      <span>·</span>
                      <span>{(t as { category?: { name: string } | null }).category!.name}</span>
                    </>
                  )}
                </div>
              </div>

              <StatusBadge status={t.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
