'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { TicketWithRelations } from '../types/ticket.types'

export function useTicket(id: string) {
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, category:categories(*), created_by_profile:profiles!created_by(*), assigned_to_profile:profiles!assigned_to(*)')
        .eq('id', id)
        .single()

      if (error) setError(error.message)
      else setTicket(data as TicketWithRelations)
      setIsLoading(false)
    }

    fetch()
  }, [id])

  return { ticket, isLoading, error }
}
