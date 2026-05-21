'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { KnowledgeArticle } from '@/types/types_db'

const PAGE_SIZE = 6

export function useArticles() {
  const { role } = useAuth()
  const [articles, setArticles]           = useState<KnowledgeArticle[]>([])
  const [isLoading, setIsLoading]         = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore]             = useState(false)
  const [page, setPage]                   = useState(0)

  useEffect(() => {
    if (!role) return
    let cancelled = false
    const loading = page === 0 ? setIsLoading : setIsLoadingMore

    async function fetchPage() {
      loading(true)
      const from = page * PAGE_SIZE

      let q = supabase
        .from('knowledge_articles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1)

      // Non-admins only see published articles
      if (role !== 'admin') q = q.eq('published', true)

      const { data, count } = await q

      if (cancelled) return
      setArticles((prev) =>
        page === 0
          ? (data ?? []) as KnowledgeArticle[]
          : [...prev, ...((data ?? []) as KnowledgeArticle[])]
      )
      setHasMore((count ?? 0) > (page + 1) * PAGE_SIZE)
      loading(false)
    }

    fetchPage()
    return () => { cancelled = true }
  }, [page, role])

  const loadMore = useCallback(() => setPage((p) => p + 1), [])
  const refetch  = useCallback(() => setPage(0), [])

  return { articles, isLoading, isLoadingMore, hasMore, loadMore, refetch }
}
