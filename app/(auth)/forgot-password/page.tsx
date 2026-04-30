import type { Metadata } from 'next'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password',
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset your password">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
