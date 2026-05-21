'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BellSimpleIcon,
  ArrowLeftIcon,
  CheckIcon,
  TicketIcon,
  QueueIcon,
  ChatCircleIcon,
  LockIcon,
  BookOpenIcon,
  ArrowSquareOutIcon,
  SpinnerIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useBasePath } from '@/hooks/useBasePath'
import type { DbNotification } from '../types/notification.types'

interface Props {
  notifications: DbNotification[]
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
  onMarkAllRead: () => void
  onMarkRead: (id: string) => void
  onClose: () => void
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function linkLabel(link: string | null): string {
  if (!link) return 'View Details'
  if (link.startsWith('tickets/')) return 'View Ticket'
  if (link === 'queue') return 'View Queue'
  if (link === 'users') return 'View Users'
  if (link.startsWith('knowledge-base')) return 'View Article'
  return 'View Details'
}

function NotifIcon({ type }: { type: string }) {
  if (type === 'comment_added')   return <ChatCircleIcon className="size-4 text-secondary shrink-0" />
  if (type === 'internal_note')   return <LockIcon       className="size-4 text-warning shrink-0" />
  if (type === 'ticket_assigned') return <QueueIcon      className="size-4 text-warning shrink-0" />
  if (type === 'kb_article')      return <BookOpenIcon   className="size-4 text-primary shrink-0" />
  if (type.startsWith('ticket'))  return <TicketIcon     className="size-4 text-primary shrink-0" />
  return <BellSimpleIcon className="size-4 text-muted-foreground shrink-0" />
}

export function NotificationPanel({
  notifications,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onMarkAllRead,
  onMarkRead,
  onClose,
}: Props) {
  const router = useRouter()
  const base   = useBasePath()
  const [selected, setSelected] = useState<DbNotification | null>(null)
  const unread = notifications.filter((n) => !n.read_at).length

  function handleSelect(n: DbNotification) {
    if (!n.read_at) onMarkRead(n.id)
    setSelected(n)
  }

  function handleNavigate(link: string | null) {
    if (!link) return
    router.push(`${base}/${link}`)
    onClose()
  }

  // ── Detail view ─────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="flex flex-col gap-4 px-4 py-2">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </button>

        <div className="rounded-lg border border-border bg-muted/30 p-4 flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <NotifIcon type={selected.type} />
            <span className="text-sm font-semibold text-foreground leading-snug">{selected.title}</span>
          </div>

          {selected.body && (
            <p className="text-sm text-muted-foreground leading-relaxed">{selected.body}</p>
          )}

          <span className="text-[11px] text-muted-foreground">{timeAgo(selected.created_at)}</span>
        </div>

        {selected.link && (
          <Button size="sm" className="w-full" onClick={() => handleNavigate(selected.link)}>
            <ArrowSquareOutIcon data-icon="inline-start" />
            {linkLabel(selected.link)}
          </Button>
        )}
      </div>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 px-4 text-center">
        <BellSimpleIcon className="size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">All caught up</p>
        <p className="text-xs text-muted-foreground">No new notifications.</p>
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col px-2">
      {unread > 0 && (
        <div className="flex items-center justify-between border-b border-border px-1 pb-3 mb-2">
          <span className="text-xs text-muted-foreground">{unread} unread</span>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onMarkAllRead}>
            <CheckIcon data-icon="inline-start" />
            Mark all read
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => handleSelect(n)}
            className={[
              'flex flex-col gap-1 rounded-md px-3 py-2.5 text-left w-full transition-colors hover:bg-muted/60',
              !n.read_at ? 'bg-muted/40' : '',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <NotifIcon type={n.type} />
                <span className="text-xs font-medium text-foreground leading-snug truncate">{n.title}</span>
              </div>
              {!n.read_at && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />}
            </div>

            {n.body && (
              <p className="text-xs text-muted-foreground leading-snug line-clamp-1 pl-6">{n.body}</p>
            )}

            <span className="text-[10px] text-muted-foreground pl-6">{timeAgo(n.created_at)}</span>
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-3 pb-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore
              ? <><SpinnerIcon className="size-3.5 animate-spin mr-1.5" />Loading…</>
              : 'Load more notifications'}
          </Button>
        </div>
      )}
    </div>
  )
}
