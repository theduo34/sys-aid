'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { BellSimpleIcon, WarningIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
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
  // /{role}/{uuid}/{page}/{subpage?}
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
  const [notifOpen, setNotifOpen] = useState(false)

  async function handleStopImpersonation() {
    await fetch('/api/admin/impersonate', { method: 'DELETE' })
    window.location.href = impersonationSession
      ? `/admin/${impersonationSession.realAdminId}/users`
      : '/login'
  }

  const pageLabel = getRouteLabel(pathname)

  return (
    <>
      <header className="flex flex-col border-b border-border bg-card shrink-0">
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

        <div className="flex h-12 items-center gap-3 px-4">
          {/* Sidebar collapse toggle */}
          <SidebarTrigger className="text-muted-foreground hover:text-foreground shrink-0" />

          {/* Separator dot */}
          <span className="text-muted-foreground/40">|</span>

          {/* Current page name */}
          <span className="text-sm font-medium text-foreground">{pageLabel}</span>

          <div className="flex-1" />

          {/* Notification bell — far right */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative text-muted-foreground hover:text-foreground transition-colors"
          >
            <BellSimpleIcon className="size-5" />
          </button>
        </div>
      </header>

      {/* Notification Sheet */}
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
    </>
  )
}
