'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Ticket, Category } from '@/types/types_db'

interface ReportData {
  tickets: Ticket[]
  categories: Category[]
}

export function useReportData() {
  const [data, setData]           = useState<ReportData>({ tickets: [], categories: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [version, setVersion]     = useState(0)

  // Increment version to trigger a fresh fetch
  const refetch = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      const [ticketsRes, catsRes] = await Promise.all([
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ])
      if (cancelled) return

      if (ticketsRes.error || catsRes.error) {
        setError((ticketsRes.error ?? catsRes.error)!.message)
        setIsLoading(false)
        return
      }

      setError(null)
      setData({
        tickets:    (ticketsRes.data ?? []) as Ticket[],
        categories: (catsRes.data  ?? []) as Category[],
      })
      setIsLoading(false)
    }

    fetchData()
    return () => { cancelled = true }
  }, [version])

  return { data, isLoading, error, refetch }
}
