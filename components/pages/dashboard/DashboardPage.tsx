import { DashboardGreeting } from '@/features/dashboard/components/DashboardGreeting'
import { StatsCards } from '@/features/dashboard/components/StatsCards'
import { QuickActions } from '@/features/dashboard/components/QuickActions'
import { RecentTickets } from '@/features/dashboard/components/RecentTickets'
import { PhoneIcon, BuildingOfficeIcon, ClockIcon } from '@phosphor-icons/react/dist/ssr'

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">

      <DashboardGreeting />

      <StatsCards />

      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Recent Activity
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="md:col-span-2 rounded-lg border border-border bg-card p-5">
            <RecentTickets />
          </div>

          <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-5">
            <span className="text-sm font-semibold text-foreground">IT Support Info</span>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted mt-0.5">
                  <ClockIcon className="size-3.5 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hours</span>
                  <span className="text-sm text-foreground">Mon – Fri, 8:00 am – 5:00 pm</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted mt-0.5">
                  <BuildingOfficeIcon className="size-3.5 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Walk-in</span>
                  <span className="text-sm text-foreground">IT Help Desk, Block A, Room 101</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted mt-0.5">
                  <PhoneIcon className="size-3.5 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Emergency</span>
                  <span className="text-sm text-foreground">Extension 1234</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                SLA Targets
              </span>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'P1 Critical', value: '4 hr' },
                  { label: 'P2 High',     value: '24 hr' },
                  { label: 'P3 Medium',   value: '72 hr' },
                  { label: 'P4 Low',      value: '1 week' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Actions
        </h2>
        <QuickActions />
      </section>

    </div>
  )
}
