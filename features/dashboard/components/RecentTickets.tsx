'use client'

import Link from 'next/link'
import { useTickets } from '@/features/tickets/hooks/useTickets'
import { useBasePath } from '@/hooks/useBasePath'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'
import type { TicketStatus } from '@/lib/constants'

const dotColor: Record<TicketStatus, string> = {
  open:        'bg-primary',
  assigned:    'bg-secondary-foreground',
  in_progress: 'bg-primary',
  pending:     'bg-muted-foreground',
  resolved:    'bg-muted-foreground',
  closed:      'bg-muted-foreground',
}

export function RecentTickets() {
  const { tickets, isLoading } = useTickets()
  const base = useBasePath()
  const recent = tickets.slice(0, 6)

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Recent Tickets</span>
        {base && (
          <Link href={`${base}/tickets`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        )}
      </div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && !recent.length && <EmptyState message="No tickets submitted yet." />}
      {!isLoading && recent.length > 0 && (
        <div className="flex flex-col gap-1">
          {recent.map((t) => (
            <Link
              key={t.id}
              href={`${base}/tickets/${t.id}`}
              className="flex items-start gap-3 rounded-md px-2 py-2.5 hover:bg-muted/40 transition-colors -mx-2"
            >
              {/* Colored bullet */}
              <div className={cn('mt-1.5 size-2 shrink-0 rounded-full', dotColor[t.status])} />

              {/* Text */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="truncate text-sm text-foreground">{t.title}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(t.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {t.category && ` · ${(t as { category?: { name: string } }).category?.name ?? ''}`}
                </span>
              </div>

              {/* Status badge */}
              <div className="shrink-0">
                <StatusBadge status={t.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
