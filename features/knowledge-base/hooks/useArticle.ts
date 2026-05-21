'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { KnowledgeArticle } from '@/types/types_db'

export function useArticle(slug: string) {
  const { role } = useAuth()
  const [article, setArticle] = useState<KnowledgeArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(() => {
    let q = supabase.from('knowledge_articles').select('*').eq('slug', slug)
    // Admins can preview unpublished articles
    if (role !== 'admin') q = q.eq('published', true)

    q.single().then(({ data }) => {
      setArticle(data)
      setIsLoading(false)
    })
  }, [slug, role])

  useEffect(() => {
    load()
  }, [load])

  const refetch = useCallback(() => {
    setIsLoading(true)
    load()
  }, [load])

  return { article, isLoading, refetch }
}
