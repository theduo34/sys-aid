'use client'

import { useBasePath } from '@/hooks/useBasePath'
import { ArticleCard } from './ArticleCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { KnowledgeArticle } from '@/types/types_db'

function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border-t-2 border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="size-4 shrink-0 rounded" />
      </div>
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-2/3 rounded" />
      <div className="flex items-center gap-3 pt-1 border-t border-border/50 mt-auto">
        <Skeleton className="h-3 w-14 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  )
}

interface ArticleListProps {
  articles:      KnowledgeArticle[]
  isLoading:     boolean
  isLoadingMore: boolean
  hasMore:       boolean
  onLoadMore:    () => void
  onEdit?:       (article: KnowledgeArticle) => void
  onDelete?:     (article: KnowledgeArticle) => void
}

export function ArticleList({
  articles,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onEdit,
  onDelete,
}: ArticleListProps) {
  const base = useBasePath()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[...Array(6)].map((_, i) => <ArticleCardSkeleton key={i} />)}
      </div>
    )
  }

  if (!articles.length) return <EmptyState message="No articles published yet." />

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {articles.map((a, i) => (
          <ArticleCard
            key={a.id}
            article={a}
            basePath={base}
            index={i}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {isLoadingMore && [...Array(2)].map((_, i) => <ArticleCardSkeleton key={`more-${i}`} />)}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={onLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading…' : 'Load more articles'}
          </Button>
        </div>
      )}
    </div>
  )
}
