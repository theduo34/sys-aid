'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { KnowledgeArticle } from '@/types/types_db'

export function useArticles() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('knowledge_articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setArticles(data ?? [])
        setIsLoading(false)
      })
  }, [])

  return { articles, isLoading }
}
