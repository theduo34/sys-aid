import type { Metadata } from 'next'
import { ReportsPage } from '@/components/pages/reports/ReportsPage'

export const metadata: Metadata = { title: 'Reports' }

export default function ReportsRoute() {
  return <ReportsPage />
}
