'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { RoleRequestWithUser } from '../types/role-request.types'

export function useRoleRequests() {
  const [requests, setRequests] = useState<RoleRequestWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('role_requests')
      .select('*, user:profiles!user_id(id, full_name, role, department)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setRequests((data as RoleRequestWithUser[]) ?? [])
        setIsLoading(false)
      })
  }, [])

  return { requests, isLoading, setRequests }
}
