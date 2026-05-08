'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { useReportData } from '../hooks/useReportData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low'] as const

export function ResolutionTimeChart() {
  const { data, isLoading, error } = useReportData()

  if (isLoading) return <LoadingSpinner />
  if (error) return <p className="text-xs text-destructive">{error}</p>

  const chartData = PRIORITY_ORDER.map((priority) => {
    const resolved = data.tickets.filter(
      (t) => t.priority === priority && t.resolved_at && t.created_at
    )
    const avgHours = resolved.length
      ? resolved.reduce((sum, t) => {
          const diff = new Date(t.resolved_at!).getTime() - new Date(t.created_at).getTime()
          return sum + diff / 3_600_000
        }, 0) / resolved.length
      : 0

    return { priority, avgHours: Math.round(avgHours * 10) / 10 }
  })

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Avg. Resolution Time (hours)
      </span>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="priority" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', fontSize: 12 }}
            formatter={(v) => [`${v}h`, 'Avg. resolution']}
          />
          <Bar dataKey="avgHours" radius={[3, 3, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.priority === 'critical' ? 'var(--destructive)' :
                  entry.priority === 'high'     ? 'var(--warning)' :
                  'var(--muted-foreground)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
