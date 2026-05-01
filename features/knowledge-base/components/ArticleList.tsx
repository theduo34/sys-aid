'use client'

import { useArticles } from '../hooks/useArticles'
import { useBasePath } from '@/hooks/useBasePath'
import { ArticleCard } from './ArticleCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'

export function ArticleList() {
  const { articles, isLoading } = useArticles()
  const base = useBasePath()

  if (isLoading) return <LoadingSpinner />
  if (!articles.length) return <EmptyState message="No articles published yet." />

  return (
    <div className="flex flex-col gap-2">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} basePath={base} />
      ))}
    </div>
  )
}
