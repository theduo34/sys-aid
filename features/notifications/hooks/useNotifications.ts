'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { DbNotification } from '../types/notification.types'

export type { DbNotification }

const INITIAL_SIZE = 10
const PAGE_SIZE    = 10

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<DbNotification[]>([])
  const [hasMore, setHasMore]             = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [limit, setLimit]                 = useState(INITIAL_SIZE)

  // Re-fetch whenever user or limit changes
  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      const { data, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (cancelled) return
      setNotifications((data as DbNotification[]) ?? [])
      setHasMore((count ?? 0) > limit)
      setIsLoadingMore(false)
    }

    load()
    return () => { cancelled = true }
  }, [user, limit])

  // Realtime: prepend new notifications as they arrive
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) => [payload.new as DbNotification, ...prev])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])

  const markRead = useCallback(async (id: string) => {
    const now = new Date().toISOString()
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: now } : n)))
    await supabase.from('notifications').update({ read_at: now }).eq('id', id)
  }, [])

  const markAllRead = useCallback(async () => {
    const now = new Date().toISOString()
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? now })))
    await supabase
      .from('notifications')
      .update({ read_at: now })
      .eq('user_id', user?.id ?? '')
      .is('read_at', null)
  }, [user])

  const loadMore = useCallback(() => {
    setIsLoadingMore(true)
    setLimit((l) => l + PAGE_SIZE)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read_at).length

  return { notifications, hasMore, isLoadingMore, loadMore, unreadCount, markRead, markAllRead }
}
