'use client'

import { useArticle } from '../hooks/useArticle'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface ArticleDetailProps {
  slug: string
}

export function ArticleDetail({ slug }: ArticleDetailProps) {
  const { article, isLoading } = useArticle(slug)

  if (isLoading) return <LoadingSpinner />
  if (!article) return <p className="text-muted-foreground">Article not found.</p>

  return (
    <article className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-foreground">{article.title}</h1>
      <p className="text-xs text-muted-foreground">{new Date(article.created_at).toLocaleDateString()}</p>
      {/* body is markdown — add remark/rehype renderer here when needed */}
      <div className="prose prose-sm text-foreground whitespace-pre-wrap">{article.body}</div>
    </article>
  )
}
