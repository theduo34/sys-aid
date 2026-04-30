'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  LayoutDashboardIcon,
  TicketIcon,
  BookOpenIcon,
  QueueIcon,
  UsersIcon,
  ChartBarIcon,
  GearIcon,
} from '@phosphor-icons/react'
import type { Role } from '@/lib/permissions'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: Role[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard',      href: '/dashboard',       icon: LayoutDashboardIcon, roles: ['student', 'staff', 'technician', 'admin'] },
  { label: 'My Tickets',     href: '/tickets',         icon: TicketIcon,          roles: ['student', 'staff', 'admin'] },
  { label: 'Knowledge Base', href: '/knowledge-base',  icon: BookOpenIcon,        roles: ['student', 'staff', 'technician', 'admin'] },
  { label: 'Queue',          href: '/agent/queue',     icon: QueueIcon,           roles: ['technician', 'admin'] },
  { label: 'Users',          href: '/admin/users',     icon: UsersIcon,           roles: ['admin'] },
  { label: 'Categories',     href: '/admin/categories',icon: GearIcon,            roles: ['admin'] },
  { label: 'Reports',        href: '/admin/reports',   icon: ChartBarIcon,        roles: ['admin'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { role } = useAuth()

  if (!role) return null

  const visible = navItems.filter((item) => item.roles.includes(role))

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center border-b border-border px-4">
        <span className="text-sm font-semibold text-foreground tracking-tight">SysAid</span>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {visible.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
              pathname.startsWith(href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
