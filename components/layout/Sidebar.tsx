'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
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
  label?: string
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
    label: 'Agent',
    items: [
      { label: 'Queue', path: 'queue', icon: QueueIcon, roles: ['technician', 'admin'] },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Users',      path: 'users',      icon: UsersIcon,   roles: ['admin'] },
      { label: 'Categories', path: 'categories', icon: GearIcon,    roles: ['admin'] },
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

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">

      {/* Brand */}
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
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-lg text-foreground">SysAid</span>
                {/*<span className="text-[11px] text-muted-foreground">IT Help Desk</span>*/}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      {/* Nav groups */}
      <SidebarContent className="px-1 py-1">
        {navGroups.map((group, gi) => {
          const visible = group.items
            .filter((item) => item.roles.includes(role))
            .map((item) => ({ ...item, href: `${base}/${item.path}` }))

          if (!visible.length) return null

          return (
            <SidebarGroup key={gi} className="py-2">
              {/*{group.label && (*/}
              {/*  <SidebarGroupLabel className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/35">*/}
              {/*    {group.label}*/}
              {/*  </SidebarGroupLabel>*/}
              {/*)}*/}
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {visible.map(({ label, href, icon: Icon }) => {
                    const active = isActive(href)
                    return (
                      <SidebarMenuItem key={href}>
                        <SidebarMenuButton
                          asChild
                          tooltip={label}
                          isActive={active}
                          className={cn(
                            'h-9 rounded-md border-none transition-colors',
                            active
                              ? 'bg-sidebar-foreground/10 text-sidebar-foreground font-semibold hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground'
                              : 'text-sidebar-foreground/50 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground'
                          )}
                        >
                          <Link href={href}>
                            <Icon className="size-4 shrink-0" />
                            <span className=" ms-1 text-sm">{label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

    </Sidebar>
  )
}
