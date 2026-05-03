import { DashboardGreeting } from '@/features/dashboard/components/DashboardGreeting'
import { StatsCards } from '@/features/dashboard/components/StatsCards'
import { QuickActions } from '@/features/dashboard/components/QuickActions'
import { RecentTickets } from '@/features/dashboard/components/RecentTickets'

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">

      {/* Greeting + CTA */}
      <DashboardGreeting />

      {/* Stats overview */}
      <StatsCards />

      {/* Recent activity + support info */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* Recent tickets — wider left column */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
            <RecentTickets />
          </div>

          {/* IT support info — narrower right column */}
          <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
            <span className="text-sm font-semibold text-foreground">IT Support Info</span>
            <div className="flex flex-col gap-4 text-sm">

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Support Hours
                </span>
                <span className="text-foreground">Mon – Fri, 8:00 am – 5:00 pm</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Walk-in Office
                </span>
                <span className="text-foreground">IT Help Desk, Block A, Room 101</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Emergency Line
                </span>
                <span className="text-foreground">Extension 1234</span>
              </div>

              <div className="border-t border-border pt-3 flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  SLA Reference
                </span>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>P1 Critical</span>
                    <span>4 hr resolution</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>P2 High</span>
                    <span>24 hr resolution</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>P3 Medium</span>
                    <span>72 hr resolution</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>P4 Low</span>
                    <span>1 week resolution</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Quick actions */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
        <QuickActions />
      </section>

    </div>
  )
}
