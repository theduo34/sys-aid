'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { TicketWithRelations } from '../types/ticket.types'

const TICKET_QUERY =
  '*, category:categories(*), created_by_profile:profiles!created_by(*), assigned_to_profile:profiles!assigned_to(*)'

export function useTicket(id: string) {
  const [ticket, setTicket]       = useState<TicketWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    function load() {
      supabase
        .from('tickets')
        .select(TICKET_QUERY)
        .eq('id', id)
        .single()
        .then(({ data, error: err }) => {
          if (cancelled) return
          if (err) setError(err.message)
          else setTicket(data as TicketWithRelations)
          setIsLoading(false)
        })
    }

    load()

    // Use a unique suffix so React StrictMode double-invoke doesn't collide
    const channelName = `ticket:${id}:${Math.random().toString(36).slice(2)}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets', filter: `id=eq.${id}` },
        () => { if (!cancelled) load() }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [id])

  return { ticket, isLoading, error }
}
