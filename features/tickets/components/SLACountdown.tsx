'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SLACountdownProps {
  deadline: string
}

function getRemainingMs(deadline: string) {
  return new Date(deadline).getTime() - Date.now()
}

export function SLACountdown({ deadline }: SLACountdownProps) {
  const [remaining, setRemaining] = useState(getRemainingMs(deadline))

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemainingMs(deadline)), 60_000)
    return () => clearInterval(timer)
  }, [deadline])

  const isOverdue = remaining < 0
  const absMs = Math.abs(remaining)
  const hours = Math.floor(absMs / 3_600_000)
  const minutes = Math.floor((absMs % 3_600_000) / 60_000)

  return (
    <span className={cn('text-xs', isOverdue ? 'text-destructive' : 'text-muted-foreground')}>
      {isOverdue ? `Overdue by ${hours}h ${minutes}m` : `SLA: ${hours}h ${minutes}m remaining`}
    </span>
  )
}
