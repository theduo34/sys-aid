'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { TicketWithRelations } from '../types/ticket.types'

export function useTickets() {
  const [tickets, setTickets] = useState<TicketWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, category:categories(*), created_by_profile:profiles!created_by(*), assigned_to_profile:profiles!assigned_to(*)')
        .order('created_at', { ascending: false })

      if (error) setError(error.message)
      else setTickets(data as TicketWithRelations[])
      setIsLoading(false)
    }

    fetch()
  }, [])

  return { tickets, isLoading, error }
}
