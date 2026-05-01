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
  iconBg: string
  iconClass: string
  roles: Role[]
}

const actions: ActionItem[] = [
  {
    label:       'Submit a Ticket',
    description: 'Report an IT issue or request',
    path:        'tickets/new',
    icon:        TicketIcon,
    iconBg:      'bg-primary/10',
    iconClass:   'text-primary',
    roles:       ['student', 'staff', 'admin'],
  },
  {
    label:       'Knowledge Base',
    description: 'Browse FAQs and IT guides',
    path:        'knowledge-base',
    icon:        BookOpenIcon,
    iconBg:      'bg-secondary',
    iconClass:   'text-secondary-foreground',
    roles:       ['student', 'staff', 'technician', 'admin'],
  },
  {
    label:       'Ticket Queue',
    description: 'Manage and resolve open tickets',
    path:        'queue',
    icon:        QueueIcon,
    iconBg:      'bg-muted',
    iconClass:   'text-muted-foreground',
    roles:       ['technician', 'admin'],
  },
  {
    label:       'Manage Users',
    description: 'View and manage user accounts',
    path:        'users',
    icon:        UserCheckIcon,
    iconBg:      'bg-muted',
    iconClass:   'text-muted-foreground',
    roles:       ['admin'],
  },
]

export function QuickActions() {
  const { role } = useAuth()
  const base = useBasePath()
  if (!role || !base) return null

  const visible = actions.filter((a) => a.roles.includes(role)).slice(0, 3)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map(({ label, description, path, icon: Icon, iconBg, iconClass }) => (
        <Link
          key={path}
          href={`${base}/${path}`}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3.5 hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-md', iconBg)}>
              <Icon className={cn('size-4', iconClass)} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">{label}</span>
              <span className="text-xs text-muted-foreground truncate">{description}</span>
            </div>
          </div>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>
      ))}
    </div>
  )
}
