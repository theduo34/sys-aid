'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/Avatar'
import { SignOutIcon, WarningIcon } from '@phosphor-icons/react'
import type { ImpersonationSession } from '@/lib/impersonation'

interface TopbarProps {
  impersonationSession?: ImpersonationSession | null
}

export function Topbar({ impersonationSession }: TopbarProps) {
  const { profile, signOut } = useAuth()

  async function handleStopImpersonation() {
    await fetch('/api/admin/impersonate', { method: 'DELETE' })
    window.location.href = '/admin/users'
  }

  return (
    <header className="flex flex-col border-b border-border">
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
      <div className="flex h-14 items-center justify-between px-4">
        <div />
        <div className="flex items-center gap-3">
          {profile && (
            <div className="flex items-center gap-2">
              <Avatar name={profile.full_name} className="size-7" />
              <span className="text-sm text-muted-foreground">{profile.full_name}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={signOut}>
            <SignOutIcon className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
