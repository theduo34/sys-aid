'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useReportData } from '../hooks/useReportData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'

const SLICE_FILLS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function CategoryBreakdown() {
  const { data, isLoading, error } = useReportData()

  if (isLoading) return <LoadingSpinner />
  if (error) return <p className="text-xs text-destructive">{error}</p>

  const countMap: Record<string, number> = {}
  const nameMap:  Record<string, string> = {}

  data.categories.forEach((c) => {
    nameMap[c.id]  = c.name
    countMap[c.id] = 0
  })

  data.tickets.forEach((t) => {
    if (t.category_id && countMap[t.category_id] !== undefined) {
      countMap[t.category_id]++
    }
  })

  const chartData = Object.entries(countMap)
    .filter(([, v]) => v > 0)
    .map(([id, value]) => ({ name: nameMap[id] ?? id, value }))
    .sort((a, b) => b.value - a.value)

  if (!chartData.length) {
    return <EmptyState message="No category data yet." description="Submit tickets to see the breakdown." />
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Tickets by Category
      </span>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="48%"
            outerRadius={72}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={SLICE_FILLS[i % SLICE_FILLS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', fontSize: 12 }}
          />
          <Legend
            iconSize={8}
            formatter={(v) => <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
