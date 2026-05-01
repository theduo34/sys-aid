import type { Metadata } from 'next'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password',
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="Reset your password"
      subtext="Remember your password?"
      subtextLink={{ label: 'Sign in', href: '/login' }}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
