'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useReportData } from '../hooks/useReportData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

function buildWeeklyData(tickets: { created_at: string }[]) {
  const map: Record<string, number> = {}
  const now = new Date()

  for (let i = 7; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    map[label] = 0
  }

  tickets.forEach((t) => {
    const d     = new Date(t.created_at)
    const delta = Math.floor((now.getTime() - d.getTime()) / (7 * 86_400_000))
    if (delta >= 0 && delta <= 7) {
      const dayD = new Date(now)
      dayD.setDate(dayD.getDate() - delta * 7)
      const label = dayD.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      if (label in map) map[label]++
    }
  })

  return Object.entries(map).map(([week, count]) => ({ week, count }))
}

export function VolumeChart() {
  const { data, isLoading, error } = useReportData()

  if (isLoading) return <LoadingSpinner />
  if (error) return <p className="text-xs text-destructive">{error}</p>

  const chartData = buildWeeklyData(data.tickets)

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Ticket Volume (last 8 weeks)
      </span>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', fontSize: 12 }}
            labelStyle={{ color: 'var(--foreground)' }}
          />
          <Bar dataKey="count" name="Tickets" fill="var(--foreground)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
