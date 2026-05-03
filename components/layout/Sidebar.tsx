'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  GridFourIcon,
  TicketIcon,
  BookOpenIcon,
  QueueIcon,
  UsersIcon,
  ChartBarIcon,
  GearIcon,
  HeadsetIcon,
} from '@phosphor-icons/react'
import type { Role } from '@/lib/permissions'

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
  roles: Role[]
}

interface NavGroup {
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard',      path: 'dashboard',      icon: GridFourIcon, roles: ['student', 'staff', 'technician', 'admin'] },
      { label: 'My Tickets',     path: 'tickets',        icon: TicketIcon,   roles: ['student', 'staff', 'admin'] },
      { label: 'Knowledge Base', path: 'knowledge-base', icon: BookOpenIcon, roles: ['student', 'staff', 'technician', 'admin'] },
    ],
  },
  {
    items: [
      { label: 'Queue', path: 'queue', icon: QueueIcon, roles: ['technician', 'admin'] },
    ],
  },
  {
    items: [
      { label: 'Users',      path: 'users',      icon: UsersIcon,    roles: ['admin'] },
      { label: 'Categories', path: 'categories', icon: GearIcon,     roles: ['admin'] },
      { label: 'Reports',    path: 'reports',    icon: ChartBarIcon, roles: ['admin'] },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { role, user } = useAuth()

  if (!role || !user) return null

  const base = `/${role}/${user.id}`

  function isActive(href: string) {
    if (href === `${base}/dashboard`) return pathname === `${base}/dashboard`
    return pathname === href || pathname.startsWith(href + '/')
  }

  const visibleGroups = navGroups
    .map((group) => ({
      items: group.items
        .filter((item) => item.roles.includes(role))
        .map((item) => ({ ...item, href: `${base}/${item.path}` })),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-default hover:bg-transparent active:bg-transparent"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-foreground shrink-0">
                <HeadsetIcon className="size-4 text-background" />
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-lg text-foreground">SysAid</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        {visibleGroups.map((group, gi) => (
          <Fragment key={gi}>
            <SidebarGroup className="py-0.5">
              <SidebarGroupContent>
                {gi > 0 && <Separator className="mb-2" />}
                <SidebarMenu className="gap-0.5">
                  {group.items.map(({ label, href, icon: Icon }) => {
                    const active = isActive(href)
                    return (
                      <SidebarMenuItem key={href}>
                        <SidebarMenuButton
                          asChild
                          tooltip={label}
                          className={cn(
                            'h-9 rounded-md border-none transition-colors',
                            active
                              ? 'bg-sidebar-foreground/10 text-sidebar-foreground font-semibold hover:bg-sidebar-foreground/15'
                              : 'text-sidebar-foreground/50 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground'
                          )}
                        >
                          <Link href={href}>
                            <Icon className="size-4 shrink-0" />
                            <span className="ms-1 text-sm">{label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </Fragment>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
