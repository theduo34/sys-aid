'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { DbNotification } from '../types/notification.types'

export type { DbNotification }

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<DbNotification[]>([])

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(30)
      if (cancelled) return
      setNotifications((data as DbNotification[]) ?? [])
    }

    load()
    return () => { cancelled = true }
  }, [user])

  // Realtime: prepend new notifications as they arrive for this user
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) => [payload.new as DbNotification, ...prev.slice(0, 29)])
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

  const unreadCount = notifications.filter((n) => !n.read_at).length

  return { notifications, unreadCount, markRead, markAllRead }
}
