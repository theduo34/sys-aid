import { DashboardGreeting } from '@/features/dashboard/components/DashboardGreeting'
import { StatsCards } from '@/features/dashboard/components/StatsCards'
import { QuickActions } from '@/features/dashboard/components/QuickActions'
import { RecentTickets } from '@/features/dashboard/components/RecentTickets'
import {
  PhoneIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ArrowSquareOutIcon,
} from '@phosphor-icons/react/dist/ssr'

const SLA_TARGETS = [
  { label: 'P1 Critical', value: '4 hr',    dot: 'bg-destructive' },
  { label: 'P2 High',     value: '24 hr',   dot: 'bg-warning' },
  { label: 'P3 Medium',   value: '72 hr',   dot: 'bg-muted-foreground' },
  { label: 'P4 Low',      value: '1 week',  dot: 'bg-muted-foreground' },
]

const SUPPORT_INFO = [
  { icon: ClockIcon,           label: 'Hours',    value: 'Mon – Fri, 8:00 am – 5:00 pm' },
  { icon: BuildingOfficeIcon,  label: 'Walk-in',  value: 'IT Help Desk, Block A, Room 101' },
  { icon: PhoneIcon,           label: 'Emergency',value: 'Extension 1234' },
]

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">

      <DashboardGreeting />

      <StatsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent tickets — takes 2/3 */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <RecentTickets />
        </div>

        {/* Support info + SLA sidebar */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
            <span className="text-sm font-semibold text-foreground">IT Support</span>

            <div className="flex flex-col gap-4">
              {SUPPORT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-sm text-foreground">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                SLA Targets
              </span>
              <div className="flex flex-col gap-2">
                {SLA_TARGETS.map(({ label, value, dot }) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`size-1.5 rounded-full ${dot} shrink-0`} />
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                    <span className="text-xs font-semibold text-foreground tabular-nums">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick link card */}
          <a
            href="https://connect.ktu.edu.gh/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 hover:bg-muted/40 transition-colors group"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">KTU Portal</span>
              <span className="text-xs text-muted-foreground">University student portal</span>
            </div>
            <ArrowSquareOutIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </a>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Actions
        </h2>
        <QuickActions />
      </section>

    </div>
  )
}
