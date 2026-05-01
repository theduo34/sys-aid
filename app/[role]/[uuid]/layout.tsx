import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getImpersonationSession } from '@/lib/impersonation'
import { cookies } from 'next/headers'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'

const VALID_ROLES = ['student', 'staff', 'technician', 'admin'] as const

interface Props {
  children: React.ReactNode
  params: Promise<{ role: string; uuid: string }>
}

export default async function RoleUuidLayout({ children, params }: Props) {
  const { role, uuid } = await params

  // Reject invalid role segments immediately
  if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    redirect('/login')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  // If UUID or role in URL does not match the real user → redirect to their correct URL
  if (user.id !== uuid || profile.role !== role) {
    redirect(`/${profile.role}/${user.id}/dashboard`)
  }

  const impersonationSession = getImpersonationSession(await cookies())

  return (
    <ProtectedLayout impersonationSession={impersonationSession}>
      {children}
    </ProtectedLayout>
  )
}
