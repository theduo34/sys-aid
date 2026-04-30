import { StatsCards } from '@/features/dashboard/components/StatsCards'
import { RecentTickets } from '@/features/dashboard/components/RecentTickets'
import { QuickActions } from '@/features/dashboard/components/QuickActions'
import { PageHeader } from '@/components/shared/PageHeader'

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" />
      <QuickActions />
      <StatsCards />
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground">Recent Tickets</h2>
        <RecentTickets />
      </section>
    </div>
  )
}
