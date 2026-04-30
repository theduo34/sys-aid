'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function useMyRoleRequest() {
  const { user } = useAuth()
  const [hasPending, setHasPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    supabase
      .from('role_requests')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .then(({ data }) => {
        setHasPending((data?.length ?? 0) > 0)
        setIsLoading(false)
      })
  }, [user])

  return { hasPending, isLoading }
}
