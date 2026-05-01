'use client'

import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/providers/AuthProvider'
import { supabase } from '@/lib/supabase/client'
import type { Role } from '@/lib/permissions'

export function useAuth() {
  const { user, profile, isLoading } = useAuthContext()
  const router = useRouter()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return {
    user,
    profile,
    role: profile?.role as Role | undefined,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  }
}
