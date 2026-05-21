import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { VerifyForm } from '@/features/auth/components/VerifyForm'

export const metadata: Metadata = {
  title: 'Verify Email',
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; code?: string }>
}) {
  const { email = '' } = await searchParams

  return (
    <AuthLayout
      heading="Check your email"
      subtext="Already verified?"
      subtextLink={{ label: 'Sign in', href: '/login' }}
    >
      <Suspense>
        <VerifyForm email={decodeURIComponent(email)} />
      </Suspense>
    </AuthLayout>
  )
}
