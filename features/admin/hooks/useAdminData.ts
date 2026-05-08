'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Profile, Category } from '@/types/types_db'

async function fetchAdminData() {
  const [usersRes, catsRes] = await Promise.all([
    supabase.from('profiles').select('*').order('full_name'),
    supabase.from('categories').select('*').order('name'),
  ])
  return {
    users:      (usersRes.data ?? []) as Profile[],
    categories: (catsRes.data ?? []) as Category[],
  }
}

export function useAdminData() {
  const [users, setUsers]           = useState<Profile[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading]   = useState(true)

  const refetch = useCallback(() => {
    return fetchAdminData().then(({ users: u, categories: c }) => {
      setUsers(u)
      setCategories(c)
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchAdminData().then(({ users: u, categories: c }) => {
      if (!cancelled) {
        setUsers(u)
        setCategories(c)
        setIsLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  return { users, categories, isLoading, refetch }
}
