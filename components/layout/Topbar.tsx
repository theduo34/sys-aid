'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BellSimpleIcon,
  WarningIcon,
  UserCircleIcon,
  GearIcon,
  SignOutIcon,
  SunIcon,
  MoonIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useBasePath } from '@/hooks/useBasePath'
import type { ImpersonationSession } from '@/lib/impersonation'

const segmentLabels: Record<string, string> = {
  'dashboard':      'Dashboard',
  'tickets':        'My Tickets',
  'knowledge-base': 'Knowledge Base',
  'queue':          'Ticket Queue',
  'users':          'Users',
  'categories':     'Categories',
  'departments':    'Departments',
  'reports':        'Reports',
}

function getRouteLabel(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length >= 3) {
    const page    = parts[2]
    const subPage = parts[3]
    if (page === 'tickets' && subPage === 'new') return 'New Ticket'
    if (page === 'tickets' && subPage)           return 'Ticket Detail'
    if (page === 'knowledge-base' && subPage)    return 'Article'
    return segmentLabels[page] ?? 'Dashboard'
  }
  return 'Dashboard'
}

interface TopbarProps {
  impersonationSession?: ImpersonationSession | null
}

export function Topbar({ impersonationSession }: TopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, user, signOut } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const base = useBasePath()
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const initials = (profile?.full_name ?? '?')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  async function handleStopImpersonation() {
    await fetch('/api/admin/impersonate', { method: 'DELETE' })
    window.location.href = impersonationSession
      ? `/admin/${impersonationSession.realAdminId}/users`
      : '/login'
  }

  const parts = pathname.split('/').filter(Boolean)
  // parts: [role, uuid, page, subPage?]
  const isSubPage = parts.length >= 4
  const parentPath = `/${parts.slice(0, 3).join('/')}`

  return (
    <>
      <header className="flex flex-col border-b border-border bg-sidebar shrink-0">
        {impersonationSession && (
          <div className="flex items-center justify-between bg-warning px-4 py-2 text-sm text-warning-foreground">
            <div className="flex items-center gap-2">
              <WarningIcon className="size-4 shrink-0" />
              <span>
                Viewing as <strong>{impersonationSession.targetUserId}</strong> ({impersonationSession.targetRole})
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={handleStopImpersonation}>
              Exit impersonation
            </Button>
          </div>
        )}

        <div className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground shrink-0" />
          {isSubPage ? (
            <button
              onClick={() => router.push(parentPath)}
              className="flex items-center justify-center rounded-full border p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="size-4" />
            </button>
          ) : (
            <span className="text-muted-foreground/40 select-none">|</span>
          )}
          <span className="text-sm font-medium text-foreground">{getRouteLabel(pathname)}</span>

          <div className="flex-1" />

          <button
            onClick={() => setNotifOpen(true)}
            className="relative text-muted-foreground hover:text-foreground transition-colors me-2"
            aria-label="Notifications"
          >
            <BellSimpleIcon className="size-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex size-8 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold shrink-0 hover:opacity-85 transition-opacity focus:outline-none"
                aria-label="User menu"
              >
                {initials}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-lg p-2 mt-1">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem asChild className="cursor-pointer rounded-md gap-2">
                <Link href={`${base}/profile`}>
                  <UserCircleIcon className="size-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer rounded-md gap-2">
                <Link href={`${base}/settings`}>
                  <GearIcon className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer rounded-md gap-2"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              >
                {resolvedTheme === 'dark'
                  ? <SunIcon className="size-4" />
                  : <MoonIcon className="size-4" />}
                {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-md gap-2"
                onClick={() => setConfirmOpen(true)}
              >
                <SignOutIcon className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent side="right" className="w-80 sm:w-96">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-base">Notifications</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <BellSimpleIcon className="size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">All caught up</p>
            <p className="text-xs text-muted-foreground">No new notifications right now.</p>
          </div>
        </SheetContent>
      </Sheet>

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
