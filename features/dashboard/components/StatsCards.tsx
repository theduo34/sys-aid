'use client'

import {
  TicketIcon,
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  ClockIcon,
} from '@phosphor-icons/react'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface Stat {
  label: string
  key: keyof NonNullable<ReturnType<typeof useDashboardStats>['stats']>
  icon: React.ElementType
  accent: string
  iconBg: string
  iconColor: string
}

const STATS: Stat[] = [
  {
    label:     'Open',
    key:       'openTickets',
    icon:      TicketIcon,
    accent:    'border-l-foreground/30',
    iconBg:    'bg-muted',
    iconColor: 'text-foreground',
  },
  {
    label:     'In Progress',
    key:       'inProgressTickets',
    icon:      ArrowsClockwiseIcon,
    accent:    'border-l-primary/60',
    iconBg:    'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    label:     'Pending Reply',
    key:       'pendingTickets',
    icon:      ClockIcon,
    accent:    'border-l-warning/60',
    iconBg:    'bg-warning/10',
    iconColor: 'text-warning-foreground',
  },
  {
    label:     'Resolved (7d)',
    key:       'resolvedThisWeek',
    icon:      CheckCircleIcon,
    accent:    'border-l-foreground/20',
    iconBg:    'bg-muted',
    iconColor: 'text-muted-foreground',
  },
  {
    label:     'Overdue',
    key:       'overdueTickets',
    icon:      WarningCircleIcon,
    accent:    'border-l-destructive',
    iconBg:    'bg-destructive/10',
    iconColor: 'text-destructive',
  },
]

export function StatsCards() {
  const { stats, isLoading } = useDashboardStats()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {STATS.map(({ label, key, icon: Icon, accent, iconBg, iconColor }) => (
        <div
          key={key}
          className={cn(
            'relative flex flex-col gap-3 overflow-hidden rounded-lg border border-border bg-card p-5',
            'border-l-4',
            accent
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className={cn('flex size-7 items-center justify-center rounded-lg', iconBg)}>
              <Icon className={cn('size-3.5', iconColor)} />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-9 w-12 rounded" />
          ) : (
            <span className="text-3xl font-bold tabular-nums leading-none text-foreground">
              {stats?.[key] ?? 0}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
