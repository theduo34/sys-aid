'use client'

import { useReportData } from '../hooks/useReportData'
import { PRIORITIES } from '@/lib/constants'
import type { Priority } from '@/lib/constants'

const priorityLabels: Record<Priority, string> = {
  critical: 'P1 Critical',
  high:     'P2 High',
  medium:   'P3 Medium',
  low:      'P4 Low',
}

export function SLAComplianceCard() {
  const { data, isLoading, error } = useReportData()

  const resolved = data.tickets.filter((t) => t.resolved_at)
  const onTime   = resolved.filter(
    (t) => !t.sla_deadline || new Date(t.sla_deadline) >= new Date(t.resolved_at!)
  )
  const overall  = resolved.length > 0 ? Math.round((onTime.length / resolved.length) * 100) : null

  const perPriority = PRIORITIES.map((p) => {
    const pResolved = resolved.filter((t) => t.priority === p)
    const pOnTime   = pResolved.filter(
      (t) => !t.sla_deadline || new Date(t.sla_deadline) >= new Date(t.resolved_at!)
    )
    const pct = pResolved.length > 0 ? Math.round((pOnTime.length / pResolved.length) * 100) : null
    return { priority: p, pct, total: pResolved.length }
  })

  if (error) return <p className="text-xs text-destructive">{error}</p>

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        SLA Compliance
      </span>

      <div className="flex items-end gap-3">
        <span className="text-5xl font-bold text-foreground tabular-nums leading-none">
          {isLoading ? '—' : overall !== null ? `${overall}%` : 'N/A'}
        </span>
        <span className="text-sm text-muted-foreground pb-1">
          of {resolved.length} resolved ticket{resolved.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {perPriority.map(({ priority, pct, total }) => (
          <div key={priority} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-16 shrink-0">
              {priorityLabels[priority as Priority]}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500"
                style={{ width: `${pct ?? 0}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-16 text-right shrink-0">
              {pct !== null ? `${pct}%` : '—'} ({total})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
