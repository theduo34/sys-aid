'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { KnowledgeArticle } from '@/types/types_db'

export function useArticle(slug: string) {
  const [article, setArticle] = useState<KnowledgeArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('knowledge_articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data }) => {
        setArticle(data)
        setIsLoading(false)
      })
  }, [slug])

  return { article, isLoading }
}
