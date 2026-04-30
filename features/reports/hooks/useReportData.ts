'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Ticket } from '@/types/types_db'

interface ReportData {
  tickets: Ticket[]
}

export function useReportData() {
  const [data, setData] = useState<ReportData>({ tickets: [] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tickets')
      .select('*')
      .then(({ data: tickets }) => {
        setData({ tickets: tickets ?? [] })
        setIsLoading(false)
      })
  }, [])

  return { data, isLoading }
}
