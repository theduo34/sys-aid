'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { TicketWithRelations } from '@/features/tickets/types/ticket.types'

const QUERY = '*, category:categories(*), created_by_profile:profiles!created_by(*), assigned_to_profile:profiles!assigned_to(*)'

async function fetchQueue() {
  const { data } = await supabase
    .from('tickets')
    .select(QUERY)
    .in('status', ['open', 'assigned', 'in_progress', 'pending'])
    .order('sla_deadline', { ascending: true })
  return (data as TicketWithRelations[]) ?? []
}

export function useAgentQueue() {
  const [tickets, setTickets] = useState<TicketWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refetch = useCallback(async () => {
    const data = await fetchQueue()
    setTickets(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('agent_queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        fetchQueue().then(setTickets)
      })
      .subscribe()

    fetchQueue().then((data) => {
      setTickets(data)
      setIsLoading(false)
    })

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { tickets, isLoading, refetch }
}
