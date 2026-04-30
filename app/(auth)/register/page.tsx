import type { Metadata } from 'next'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account',
}

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account">
      <RegisterForm />
    </AuthLayout>
  )
}
