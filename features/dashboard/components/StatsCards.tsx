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
      iconClass: 'text-primary',
      iconBg:    'bg-primary/10',
    },
    {
      label:     'In Progress',
      value:     stats?.inProgressTickets,
      icon:      ArrowsClockwiseIcon,
      iconClass: 'text-secondary-foreground',
      iconBg:    'bg-secondary',
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ label, value, icon: Icon, iconClass, iconBg }) => (
        <div
          key={label}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
        >
          {/* Icon circle — top of card */}
          <div className={cn('size-10 flex items-center justify-center rounded-full', iconBg)}>
            <Icon className={cn('size-5', iconClass)} />
          </div>

          {/* Number + label */}
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                'text-2xl font-bold tabular-nums leading-none text-foreground',
                isLoading && 'animate-pulse text-muted-foreground'
              )}
            >
              {isLoading ? '—' : (value ?? 0)}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
