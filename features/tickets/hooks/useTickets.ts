'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { TicketWithRelations } from '../types/ticket.types'

const PAGE_SIZE = 15
const QUERY = '*, category:categories(*), created_by_profile:profiles!created_by(*), assigned_to_profile:profiles!assigned_to(*)'

export function useTickets() {
  const [tickets, setTickets]   = useState<TicketWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [page, setPage]         = useState(0)

  useEffect(() => {
    let cancelled = false
    const loading = page === 0 ? setIsLoading : setIsLoadingMore

    async function fetchPage() {
      loading(true)
      const from = page * PAGE_SIZE
      const { data, error: err, count } = await supabase
        .from('tickets')
        .select(QUERY, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1)

      if (cancelled) return
      if (err) { setError(err.message); loading(false); return }

      setTickets((prev) => page === 0 ? (data as TicketWithRelations[]) : [...prev, ...(data as TicketWithRelations[])])
      setHasMore((count ?? 0) > (page + 1) * PAGE_SIZE)
      loading(false)
    }

    fetchPage()
    return () => { cancelled = true }
  }, [page])

  const loadMore = useCallback(() => setPage((p) => p + 1), [])

  return { tickets, isLoading, isLoadingMore, hasMore, loadMore, error }
}
