import type { Metadata } from 'next'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function LoginPage() {
  return (
    <AuthLayout
      heading="Sign in to SysAid"
      subtext="Don't have an account?"
      subtextLink={{ label: 'Create one', href: '/register' }}
    >
      <LoginForm />
    </AuthLayout>
  )
}
