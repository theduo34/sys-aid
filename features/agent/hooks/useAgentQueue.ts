'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { TicketWithRelations } from '@/features/tickets/types/ticket.types'

const PAGE_SIZE = 15
const QUERY = '*, category:categories(*), created_by_profile:profiles!created_by(*), assigned_to_profile:profiles!assigned_to(*)'

export function useAgentQueue() {
  const [tickets, setTickets]         = useState<TicketWithRelations[]>([])
  const [isLoading, setIsLoading]     = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore]         = useState(false)
  const [page, setPage]               = useState(0)

  useEffect(() => {
    let cancelled = false
    const loading = page === 0 ? setIsLoading : setIsLoadingMore

    async function fetchPage() {
      loading(true)
      const from = page * PAGE_SIZE
      const { data, count } = await supabase
        .from('tickets')
        .select(QUERY, { count: 'exact' })
        .in('status', ['open', 'assigned', 'in_progress', 'pending'])
        .order('sla_deadline', { ascending: true })
        .range(from, from + PAGE_SIZE - 1)

      if (cancelled) return
      setTickets((prev) => page === 0 ? (data as TicketWithRelations[]) ?? [] : [...prev, ...((data as TicketWithRelations[]) ?? [])])
      setHasMore((count ?? 0) > (page + 1) * PAGE_SIZE)
      loading(false)
    }

    fetchPage()
    return () => { cancelled = true }
  }, [page])

  // Realtime: reset to first page on any ticket change
  useEffect(() => {
    const channel = supabase
      .channel('agent_queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => setPage(0))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const loadMore = useCallback(() => setPage((p) => p + 1), [])
  const refetch  = useCallback(() => setPage(0), [])

  return { tickets, isLoading, isLoadingMore, hasMore, loadMore, refetch }
}
