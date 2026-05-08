'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { KnowledgeArticle } from '@/types/types_db'

async function fetchArticles(): Promise<KnowledgeArticle[]> {
  const { data } = await supabase
    .from('knowledge_articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  return (data ?? []) as KnowledgeArticle[]
}

export function useArticles() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refetch = useCallback(() => {
    return fetchArticles().then(setArticles)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchArticles().then((data) => {
      if (!cancelled) {
        setArticles(data)
        setIsLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  return { articles, isLoading, refetch }
}
