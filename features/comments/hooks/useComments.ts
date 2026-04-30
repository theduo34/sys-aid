'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { CommentWithAuthor } from '../types/comment.types'

export function useComments(ticketId: string) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('comments')
        .select('*, author:profiles!author_id(id, full_name, role)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

      setComments((data as CommentWithAuthor[]) ?? [])
      setIsLoading(false)
    }

    fetch()

    // Subscribe to live comment additions on this ticket
    const channel = supabase
      .channel(`comments:${ticketId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `ticket_id=eq.${ticketId}` }, () => fetch())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [ticketId])

  return { comments, isLoading }
}
