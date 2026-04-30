'use client'

import { useReportData } from '../hooks/useReportData'

export function SLAComplianceCard() {
  const { data, isLoading } = useReportData()

  const total   = data.tickets.length
  const onTime  = data.tickets.filter((t) => !t.sla_deadline || !t.resolved_at || new Date(t.sla_deadline) >= new Date(t.resolved_at)).length
  const percent = total > 0 ? Math.round((onTime / total) * 100) : 0

  if (isLoading) return null

  return (
    <div className="flex flex-col gap-1 border border-border p-4">
      <span className="text-2xl font-semibold text-foreground">{percent}%</span>
      <span className="text-xs text-muted-foreground">SLA compliance</span>
    </div>
  )
}
