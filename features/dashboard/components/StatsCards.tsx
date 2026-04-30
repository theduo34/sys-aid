'use client'

import { useDashboardStats } from '../hooks/useDashboardStats'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export function StatsCards() {
  const { stats, isLoading } = useDashboardStats()

  if (isLoading) return <LoadingSpinner />

  const cards = [
    { label: 'Open',            value: stats?.openTickets },
    { label: 'In progress',     value: stats?.inProgressTickets },
    { label: 'Resolved (7d)',   value: stats?.resolvedThisWeek },
    { label: 'Overdue',         value: stats?.overdueTickets },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-1 border border-border p-4">
          <span className="text-2xl font-semibold text-foreground">{value ?? 0}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}
