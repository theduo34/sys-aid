'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  GridFourIcon,
  TicketIcon,
  BookOpenIcon,
  QueueIcon,
  UsersIcon,
  ChartBarIcon,
  GearIcon,
  SignOutIcon,
  HeadsetIcon,
  CaretUpDownIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import type { Role } from '@/lib/permissions'

interface NavDef {
  label: string
  path: string  // path segment after /{role}/{uuid}/
  icon: React.ElementType
  roles: Role[]
}

const navDefs: NavDef[] = [
  { label: 'Dashboard',      path: 'dashboard',      icon: GridFourIcon,  roles: ['student', 'staff', 'technician', 'admin'] },
  { label: 'My Tickets',     path: 'tickets',        icon: TicketIcon,    roles: ['student', 'staff', 'admin'] },
  { label: 'Knowledge Base', path: 'knowledge-base', icon: BookOpenIcon,  roles: ['student', 'staff', 'technician', 'admin'] },
  { label: 'Queue',          path: 'queue',          icon: QueueIcon,     roles: ['technician', 'admin'] },
  { label: 'Users',          path: 'users',          icon: UsersIcon,     roles: ['admin'] },
  { label: 'Categories',     path: 'categories',     icon: GearIcon,      roles: ['admin'] },
  { label: 'Reports',        path: 'reports',        icon: ChartBarIcon,  roles: ['admin'] },
]

const roleLabels: Record<Role, string> = {
  student:    'Student',
  staff:      'Staff / Lecturer',
  technician: 'IT Technician',
  admin:      'Administrator',
}

export function AppSidebar() {
  const pathname = usePathname()
  const { role, profile, user, signOut } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!role || !user) return null

  const base = `/${role}/${user.id}`

  const visible = navDefs
    .filter((d) => d.roles.includes(role))
    .map((d) => ({ ...d, href: `${base}/${d.path}` }))

  const initials = (profile?.full_name ?? '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  function isActive(href: string) {
    if (href === `${base}/dashboard`) return pathname === `${base}/dashboard`
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
    <Sidebar collapsible="icon" className="border-r-0">

      {/* Brand header */}
      <SidebarHeader className="bg-primary p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-primary-foreground/10 rounded-md border-none cursor-default"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15 shrink-0">
                <HeadsetIcon className="size-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm text-primary-foreground">SysAid</span>
                <span className="text-[11px] text-primary-foreground/60">IT Help Desk</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="bg-primary-foreground/10 mx-0" />

      {/* Nav items */}
      <SidebarContent className="bg-primary px-2 py-2">
        <SidebarMenu>
          {visible.map(({ label, href, icon: Icon }) => {
            const active = isActive(href)
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  tooltip={label}
                  isActive={active}
                  className={cn(
                    'rounded-md h-9 border-none transition-colors',
                    active
                      ? 'bg-primary-foreground text-primary font-medium hover:bg-primary-foreground hover:text-primary'
                      : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                  )}
                >
                  <Link href={href}>
                    <Icon
                      className={cn(
                        'size-4 shrink-0',
                        active ? 'text-primary' : 'text-primary-foreground/60'
                      )}
                    />
                    <span className="text-sm">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="bg-primary-foreground/10 mx-0" />

      {/* User footer with dropdown */}
      <SidebarFooter className="bg-primary p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={profile?.full_name ?? ''}
                  className="hover:bg-primary-foreground/10 text-primary-foreground rounded-md border-none"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/20 shrink-0 text-xs font-bold text-primary-foreground">
                    {initials}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 group-data-[collapsible=icon]:hidden flex-1">
                    <span className="text-sm font-medium text-primary-foreground truncate">
                      {profile?.full_name}
                    </span>
                    <span className="text-[11px] text-primary-foreground/50 truncate">
                      {roleLabels[role]}
                    </span>
                  </div>
                  <CaretUpDownIcon className="ml-auto size-3.5 text-primary-foreground/40 shrink-0 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="start" className="w-56 mb-1 rounded-sm p-2">
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link href={`${base}/profile`}>
                    <UserCircleIcon className="size-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                  <Link href={`${base}/settings`}>
                    <GearIcon className="size-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-lg"
                  onClick={() => setConfirmOpen(true)}
                >
                  <SignOutIcon className="size-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>

    <ConfirmDialog
      open={confirmOpen}
      title="Sign out?"
      description="You will be returned to the login page."
      confirmLabel="Sign out"
      cancelLabel="Cancel"
      destructive
      onConfirm={signOut}
      onCancel={() => setConfirmOpen(false)}
    />
    </>
  )
}
