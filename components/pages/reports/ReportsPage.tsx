import { VolumeChart } from '@/features/reports/components/VolumeChart'
import { ResolutionTimeChart } from '@/features/reports/components/ResolutionTimeChart'
import { CategoryBreakdown } from '@/features/reports/components/CategoryBreakdown'
import { SLAComplianceCard } from '@/features/reports/components/SLAComplianceCard'
import { PageHeader } from '@/components/shared/PageHeader'

export function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reports" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SLAComplianceCard />
        <CategoryBreakdown />
        <VolumeChart />
        <ResolutionTimeChart />
      </div>
    </div>
  )
}
