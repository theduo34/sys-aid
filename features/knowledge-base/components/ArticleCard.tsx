import Link from 'next/link'
import type { KnowledgeArticle } from '@/types/types_db'

interface ArticleCardProps {
  article: KnowledgeArticle
  basePath: string
}

export function ArticleCard({ article, basePath }: ArticleCardProps) {
  return (
    <Link href={`${basePath}/knowledge-base/${article.slug}`} className="flex flex-col gap-1 border border-border p-4 hover:bg-muted/50">
      <span className="text-sm font-medium text-foreground">{article.title}</span>
      <span className="text-xs text-muted-foreground">{new Date(article.created_at).toLocaleDateString()}</span>
    </Link>
  )
}
