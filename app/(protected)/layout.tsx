import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getImpersonationSession } from '@/lib/impersonation'
import { cookies } from 'next/headers'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'

export default async function ProtectedRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const impersonationSession = getImpersonationSession(cookies())

  return (
    <ProtectedLayout impersonationSession={impersonationSession}>
      {children}
    </ProtectedLayout>
  )
}
