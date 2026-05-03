import { VolumeChart } from '@/features/reports/components/VolumeChart'
import { ResolutionTimeChart } from '@/features/reports/components/ResolutionTimeChart'
import { CategoryBreakdown } from '@/features/reports/components/CategoryBreakdown'
import { SLAComplianceCard } from '@/features/reports/components/SLAComplianceCard'

export function ReportsPage() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SLAComplianceCard />
      <CategoryBreakdown />
      <VolumeChart />
      <ResolutionTimeChart />
    </div>
  )
}
