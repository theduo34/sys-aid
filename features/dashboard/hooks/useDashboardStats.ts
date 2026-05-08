'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface DashboardStats {
  openTickets: number
  inProgressTickets: number
  resolvedThisWeek: number
  overdueTickets: number
  pendingTickets: number
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const now     = new Date().toISOString()
      const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString()

      const [open, inProgress, resolved, overdue, pending] = await Promise.all([
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'resolved').gte('resolved_at', weekAgo),
        supabase.from('tickets').select('id', { count: 'exact', head: true }).lt('sla_deadline', now).not('status', 'in', '("resolved","closed")'),
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ])

      if (cancelled) return
      setStats({
        openTickets:       open.count       ?? 0,
        inProgressTickets: inProgress.count ?? 0,
        resolvedThisWeek:  resolved.count   ?? 0,
        overdueTickets:    overdue.count     ?? 0,
        pendingTickets:    pending.count     ?? 0,
      })
      setIsLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { stats, isLoading }
}
