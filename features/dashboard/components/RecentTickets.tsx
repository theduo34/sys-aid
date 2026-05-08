'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { useTickets } from '@/features/tickets/hooks/useTickets'
import { useBasePath } from '@/hooks/useBasePath'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/EmptyState'

export function RecentTickets() {
  const { tickets, isLoading } = useTickets()
  const base = useBasePath()
  const recent = tickets.slice(0, 6)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Recent Tickets</span>
        {base && !isLoading && tickets.length > 0 && (
          <Link
            href={`${base}/tickets`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <ArrowRightIcon className="size-3" />
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-1 py-2.5">
              <Skeleton className="size-8 rounded-lg shrink-0" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !recent.length && (
        <EmptyState
          message="No tickets yet."
          description="Submit your first IT support ticket to get started."
        />
      )}

      {!isLoading && recent.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {recent.map((t) => (
            <Link
              key={t.id}
              href={`${base}/tickets/${t.id}`}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors -mx-3"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground group-hover:bg-muted/70 transition-colors">
                #{t.id.slice(-4).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-foreground leading-snug">{t.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(t.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {(t as { category?: { name: string } | null }).category?.name && (
                    <span className="ms-1.5 text-muted-foreground/60">
                      · {(t as { category?: { name: string } | null }).category!.name}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <PriorityBadge priority={t.priority} />
                <StatusBadge status={t.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
