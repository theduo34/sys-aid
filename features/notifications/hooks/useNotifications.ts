'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { TicketWithRelations } from '@/features/tickets/types/ticket.types'

export interface AppNotification {
  id: string
  type: 'ticket_assigned' | 'status_changed' | 'comment_added' | 'ticket_created'
  title: string
  body: string
  ticketId: string
  createdAt: string
  read: boolean
}

export function useNotifications() {
  const { user, role } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  // Track the IDs of tickets the user owns so we can filter comment events
  const ownedTicketIds = useRef<Set<string>>(new Set())

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const push = useCallback((n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications((prev) => [
      { ...n, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false },
      ...prev.slice(0, 49),
    ])
  }, [])

  useEffect(() => {
    if (!user || !role) return

    // Load tickets the user owns so comment events can reference them
    supabase
      .from('tickets')
      .select('id')
      .eq('created_by', user.id)
      .then(({ data }) => {
        ownedTicketIds.current = new Set(data?.map((t) => t.id) ?? [])
      })

    const channels: ReturnType<typeof supabase.channel>[] = []

    if (role === 'student' || role === 'staff') {
      // Notify submitter when their ticket changes
      const ch = supabase
        .channel(`notifications:tickets:${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `created_by=eq.${user.id}` },
          (payload) => {
            const t = payload.new as TicketWithRelations
            push({
              type: 'status_changed',
              title: 'Ticket updated',
              body: `Your ticket status changed to "${String(t.status).replace('_', ' ')}"`,
              ticketId: t.id,
            })
          }
        )
        .subscribe()
      channels.push(ch)
    }

    if (role === 'technician') {
      // Notify technician when a ticket is assigned to them
      const ch = supabase
        .channel(`notifications:assigned:${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `assigned_to=eq.${user.id}` },
          (payload) => {
            const t = payload.new as TicketWithRelations
            if (t.status === 'assigned') {
              push({
                type: 'ticket_assigned',
                title: 'New ticket assigned',
                body: `Ticket "${t.title}" has been assigned to you`,
                ticketId: t.id,
              })
            }
          }
        )
        .subscribe()
      channels.push(ch)
    }

    if (role === 'admin') {
      // Notify admin when any new ticket is created
      const ch = supabase
        .channel(`notifications:admin:${user.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'tickets' },
          (payload) => {
            const t = payload.new as TicketWithRelations
            push({
              type: 'ticket_created',
              title: 'New ticket submitted',
              body: `"${t.title}" — ${String(t.priority).toUpperCase()} priority`,
              ticketId: t.id,
            })
          }
        )
        .subscribe()
      channels.push(ch)
    }

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch))
    }
  }, [user, role, push])

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, unreadCount, markRead, markAllRead }
}
