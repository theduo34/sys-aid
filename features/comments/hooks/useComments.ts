'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { CommentWithAuthor } from '../types/comment.types'

export function useComments(ticketId: string) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [version, setVersion]   = useState(0)

  const refetch = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    let cancelled = false
    async function fetchComments() {
      const { data } = await supabase
        .from('comments')
        .select('*, author:profiles!author_id(id, full_name, role)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })
      if (cancelled) return
      setComments((data as CommentWithAuthor[]) ?? [])
      setIsLoading(false)
    }
    fetchComments()
    return () => { cancelled = true }
  }, [ticketId, version])

  useEffect(() => {
    const channel = supabase
      .channel(`comments:${ticketId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `ticket_id=eq.${ticketId}` }, () => setVersion((v) => v + 1))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [ticketId])

  return { comments, isLoading, refetch }
}
