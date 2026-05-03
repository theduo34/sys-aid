'use client'

import Link from 'next/link'
import {
  TicketIcon,
  BookOpenIcon,
  QueueIcon,
  ArrowRightIcon,
  UserCheckIcon,
} from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useBasePath } from '@/hooks/useBasePath'
import { cn } from '@/lib/utils'
import type { Role } from '@/lib/permissions'

interface ActionItem {
  label: string
  description: string
  path: string
  icon: React.ElementType
  roles: Role[]
}

const actions: ActionItem[] = [
  {
    label:       'Submit a Ticket',
    description: 'Report an IT issue or service request',
    path:        'tickets/new',
    icon:        TicketIcon,
    roles:       ['student', 'staff', 'admin'],
  },
  {
    label:       'Knowledge Base',
    description: 'Browse FAQs and IT guides',
    path:        'knowledge-base',
    icon:        BookOpenIcon,
    roles:       ['student', 'staff', 'technician', 'admin'],
  },
  {
    label:       'Ticket Queue',
    description: 'Manage and resolve open tickets',
    path:        'queue',
    icon:        QueueIcon,
    roles:       ['technician', 'admin'],
  },
  {
    label:       'Manage Users',
    description: 'View and manage user accounts',
    path:        'users',
    icon:        UserCheckIcon,
    roles:       ['admin'],
  },
]

export function QuickActions() {
  const { role } = useAuth()
  const base = useBasePath()
  if (!role || !base) return null

  const visible = actions.filter((a) => a.roles.includes(role)).slice(0, 3)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {visible.map(({ label, description, path, icon: Icon }) => (
        <Link
          key={path}
          href={`${base}/${path}`}
          className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4 hover:border-foreground/20 transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground truncate">{description}</span>
            </div>
          </div>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>
      ))}
    </div>
  )
}
