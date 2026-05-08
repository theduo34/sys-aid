'use client'

import { useState } from 'react'
import { useAdminData } from '../hooks/useAdminData'
import { useImpersonation } from '../hooks/useImpersonation'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Avatar } from '@/components/shared/Avatar'
import { ResponsiveModal } from '@/components/shared/ResponsiveModal'
import { UserForm } from './UserForm'
import { Button } from '@/components/ui/button'
import { PencilSimpleIcon, UserSwitchIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useDebounce } from '@/hooks/useDebounce'
import type { Profile } from '@/types/types_db'

const rolePill: Record<Profile['role'], string> = {
  student:    'bg-muted text-muted-foreground',
  staff:      'bg-secondary text-secondary-foreground',
  technician: 'bg-primary/10 text-primary',
  admin:      'bg-warning/15 text-warning-foreground',
}

const PAGE_SIZE = 20

export function UserTable() {
  const { users, isLoading, refetch } = useAdminData()
  const { startImpersonation } = useImpersonation()
  const [search, setSearch]     = useState('')
  const [editUser, setEditUser] = useState<Profile | null>(null)
  const [visible, setVisible]   = useState(PAGE_SIZE)
  const debouncedSearch = useDebounce(search, 200)

  const filtered = users.filter((u) => {
    const q = debouncedSearch.toLowerCase()
    return (
      u.full_name.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.department ?? '').toLowerCase().includes(q)
    )
  })

  const shown   = filtered.slice(0, visible)
  const hasMore = filtered.length > visible

  if (isLoading) return <LoadingSpinner />

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, role, or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Department</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Joined</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={u.full_name} className="size-7 text-[11px] shrink-0" />
                      <span className="font-medium text-foreground truncate max-w-[160px]">{u.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ${rolePill[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {u.department ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                    {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={() => setEditUser(u)}
                        title="Edit user"
                      >
                        <PencilSimpleIcon className="size-3.5" />
                      </Button>
                      {u.role !== 'admin' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2"
                          onClick={() => startImpersonation(u.id, `Admin review for ${u.full_name}`)}
                          title="Impersonate"
                        >
                          <UserSwitchIcon className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && (
            <p className="py-10 text-center text-sm text-muted-foreground">No users match your search.</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {Math.min(visible, filtered.length)} of {filtered.length} users
          </p>
          {hasMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Load more
            </Button>
          )}
        </div>
      </div>

      <ResponsiveModal
        open={!!editUser}
        onOpenChange={(open) => { if (!open) setEditUser(null) }}
        title={`Edit — ${editUser?.full_name ?? ''}`}
        description="Update this user's role or department."
      >
        {editUser && (
          <UserForm
            user={editUser}
            onSaved={() => {
              setEditUser(null)
              refetch()
            }}
          />
        )}
      </ResponsiveModal>
    </>
  )
}
