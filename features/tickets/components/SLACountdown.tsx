'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SLACountdownProps {
  deadline: string
}

function getRemainingMs(deadline: string) {
  return new Date(deadline).getTime() - Date.now()
}

function humanizeDuration(absMs: number): string {
  const hours  = Math.floor(absMs / 3_600_000)
  const mins   = Math.floor((absMs % 3_600_000) / 60_000)
  const days   = Math.floor(absMs / 86_400_000)
  const weeks  = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years  = Math.floor(days / 365)

  if (hours < 48)  return `${hours}h ${mins}m`
  if (days  < 14)  return `${days} day${days !== 1 ? 's' : ''}`
  if (months < 1)  return `${weeks} week${weeks !== 1 ? 's' : ''}`
  if (years  < 1)  return `${months} month${months !== 1 ? 's' : ''}`
  return `${years} year${years !== 1 ? 's' : ''}`
}

export function SLACountdown({ deadline }: SLACountdownProps) {
  const [remaining, setRemaining] = useState(getRemainingMs(deadline))

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemainingMs(deadline)), 60_000)
    return () => clearInterval(timer)
  }, [deadline])

  const isOverdue = remaining < 0
  const label     = humanizeDuration(Math.abs(remaining))

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium',
      isOverdue ? 'text-destructive' : 'text-muted-foreground'
    )}>
      {isOverdue ? `Overdue by ${label}` : `SLA: ${label} remaining`}
    </span>
  )
}
