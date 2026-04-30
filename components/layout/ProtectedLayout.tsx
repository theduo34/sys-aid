import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import type { ImpersonationSession } from '@/lib/impersonation'

interface ProtectedLayoutProps {
  children: React.ReactNode
  impersonationSession?: ImpersonationSession | null
}

export function ProtectedLayout({ children, impersonationSession }: ProtectedLayoutProps) {
  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar impersonationSession={impersonationSession} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
