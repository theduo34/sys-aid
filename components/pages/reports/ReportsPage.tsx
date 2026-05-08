import { VolumeChart } from '@/features/reports/components/VolumeChart'
import { ResolutionTimeChart } from '@/features/reports/components/ResolutionTimeChart'
import { CategoryBreakdown } from '@/features/reports/components/CategoryBreakdown'
import { SLAComplianceCard } from '@/features/reports/components/SLAComplianceCard'

export function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <SLAComplianceCard />
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <CategoryBreakdown />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <VolumeChart />
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <ResolutionTimeChart />
        </div>
      </div>
    </div>
  )
}
