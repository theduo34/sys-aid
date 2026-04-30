'use client'

import { useAuthContext } from '@/providers/AuthProvider'
import { supabase } from '@/lib/supabase/client'
import type { Role } from '@/lib/permissions'

export function useAuth() {
  const { user, profile, isLoading } = useAuthContext()

  async function signOut() {
    await supabase.auth.signOut()
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
