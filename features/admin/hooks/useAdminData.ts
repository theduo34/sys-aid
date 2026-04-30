'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Profile, Category } from '@/types/types_db'

export function useAdminData() {
  const [users, setUsers] = useState<Profile[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const [usersRes, catsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('full_name'),
        supabase.from('categories').select('*').order('name'),
      ])
      setUsers(usersRes.data ?? [])
      setCategories(catsRes.data ?? [])
      setIsLoading(false)
    }
    fetch()
  }, [])

  return { users, categories, isLoading }
}
