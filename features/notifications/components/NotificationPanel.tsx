'use client'

import Link from 'next/link'
import { BellSimpleIcon, CheckIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useBasePath } from '@/hooks/useBasePath'
import type { AppNotification } from '../hooks/useNotifications'

interface NotificationPanelProps {
  notifications: AppNotification[]
  onMarkAllRead: () => void
  onMarkRead: (id: string) => void
  onClose: () => void
}

export function NotificationPanel({
  notifications,
  onMarkAllRead,
  onMarkRead,
  onClose,
}: NotificationPanelProps) {
  const base = useBasePath()
  const unread = notifications.filter((n) => !n.read).length

  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <BellSimpleIcon className="size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">All caught up</p>
        <p className="text-xs text-muted-foreground">No new notifications.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0">
      {unread > 0 && (
        <div className="flex items-center justify-between border-b border-border px-1 pb-3 mb-2">
          <span className="text-xs text-muted-foreground">{unread} unread</span>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onMarkAllRead}>
            <CheckIcon className="size-3 me-1" />
            Mark all read
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-0.5 max-h-96 overflow-y-auto">
        {notifications.map((n) => (
          <Link
            key={n.id}
            href={`${base}/tickets/${n.ticketId}`}
            onClick={() => { onMarkRead(n.id); onClose() }}
            className={`flex flex-col gap-1 rounded-md px-3 py-2.5 hover:bg-muted/60 transition-colors ${!n.read ? 'bg-muted/40' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-foreground leading-snug">{n.title}</span>
              {!n.read && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />}
            </div>
            <p className="text-xs text-muted-foreground leading-snug">{n.body}</p>
            <span className="text-[10px] text-muted-foreground">
              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
