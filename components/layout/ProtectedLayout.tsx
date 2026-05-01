import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './Sidebar'
import { Topbar } from './Topbar'
import type { ImpersonationSession } from '@/lib/impersonation'

interface ProtectedLayoutProps {
  children: React.ReactNode
  impersonationSession?: ImpersonationSession | null
}

export function ProtectedLayout({ children, impersonationSession }: ProtectedLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AppSidebar />
        {/* flex-col + h-screen: topbar is fixed at top, main scrolls independently */}
        <SidebarInset className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          <Topbar impersonationSession={impersonationSession} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
