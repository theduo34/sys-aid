'use client'

import {
  TicketIcon,
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  ClockIcon,
} from '@phosphor-icons/react'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { cn } from '@/lib/utils'

interface CardDef {
  label: string
  value: number | undefined
  icon: React.ElementType
  iconClass: string
  iconBg: string
}

export function StatsCards() {
  const { stats, isLoading } = useDashboardStats()

  const cards: CardDef[] = [
    {
      label:     'Open Tickets',
      value:     stats?.openTickets,
      icon:      TicketIcon,
      iconClass: 'text-muted-foreground',
      iconBg:    'bg-muted',
    },
    {
      label:     'In Progress',
      value:     stats?.inProgressTickets,
      icon:      ArrowsClockwiseIcon,
      iconClass: 'text-muted-foreground',
      iconBg:    'bg-muted',
    },
    {
      label:     'Resolved (7 days)',
      value:     stats?.resolvedThisWeek,
      icon:      CheckCircleIcon,
      iconClass: 'text-muted-foreground',
      iconBg:    'bg-muted',
    },
    {
      label:     'Overdue',
      value:     stats?.overdueTickets,
      icon:      WarningCircleIcon,
      iconClass: 'text-destructive',
      iconBg:    'bg-destructive/10',
    },
    {
      label:     'Pending Response',
      value:     undefined,
      icon:      ClockIcon,
      iconClass: 'text-muted-foreground',
      iconBg:    'bg-muted',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {cards.map(({ label, value, icon: Icon, iconClass, iconBg }) => (
        <div
          key={label}
          className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
            <div className={cn('flex size-7 items-center justify-center rounded-md', iconBg)}>
              <Icon className={cn('size-3.5', iconClass)} />
            </div>
          </div>
          <span
            className={cn(
              'text-3xl font-bold tabular-nums leading-none text-foreground',
              isLoading && 'animate-pulse text-muted-foreground'
            )}
          >
            {isLoading ? '—' : (value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  )
}
