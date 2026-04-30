'use client'

import { SLA_HOURS, PRIORITIES } from '@/lib/constants'

export function SLASettings() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs text-muted-foreground">
          <th className="pb-2 font-medium">Priority</th>
          <th className="pb-2 font-medium">Response (h)</th>
          <th className="pb-2 font-medium">Resolution (h)</th>
        </tr>
      </thead>
      <tbody>
        {PRIORITIES.map((p) => (
          <tr key={p} className="border-b border-border">
            <td className="py-2 capitalize text-foreground">{p}</td>
            <td className="py-2 text-muted-foreground">{SLA_HOURS[p].response}</td>
            <td className="py-2 text-muted-foreground">{SLA_HOURS[p].resolution}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
