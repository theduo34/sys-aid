import type { Metadata } from 'next'
import { LandingPage } from '@/components/pages/LandingPage'

export const metadata: Metadata = {
  title: 'SysAid — Campus IT Help Desk',
  description: 'Submit IT support tickets, track resolutions in real time, and browse the knowledge base at Koforidua Technical University.',
}

export default function RootPage() {
  return <LandingPage />
}
