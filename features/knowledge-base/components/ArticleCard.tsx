import Link from 'next/link'
import { ArrowRightIcon, ClockIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr'
import type { KnowledgeArticle } from '@/types/types_db'

const ACCENTS = [
  'border-t-destructive/60',
  'border-t-warning/80',
  'border-t-primary/40',
]

function readingTime(body: string): number {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200))
}

function makeExcerpt(body: string, max = 110): string {
  const plain = body.replace(/^#{1,6}\s+/gm, '').replace(/[*_`\[\]]/g, '').trim()
  return plain.length > max ? plain.slice(0, max).trimEnd() + '…' : plain
}

interface ArticleCardProps {
  article:  KnowledgeArticle
  basePath: string
  index?:   number
  onEdit?:  (article: KnowledgeArticle) => void
  onDelete?:(article: KnowledgeArticle) => void
}

export function ArticleCard({ article, basePath, index = 0, onEdit, onDelete }: ArticleCardProps) {
  const accent  = ACCENTS[index % ACCENTS.length]
  const mins    = readingTime(article.body ?? '')
  const excerpt = makeExcerpt(article.body ?? '')
  const date    = new Date(article.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const hasActions = onEdit || onDelete

  return (
    <div className={`group flex flex-col rounded-xl border-t-2 border border-border bg-card hover:shadow-md hover:border-border/60 transition-all duration-200 overflow-hidden ${accent}`}>
      <Link
        href={`${basePath}/knowledge-base/${article.slug}`}
        className="flex flex-col gap-3 p-5 flex-1"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <ArrowRightIcon className="size-4 shrink-0 mt-0.5 text-muted-foreground/30 translate-x-0 group-hover:translate-x-1 group-hover:text-muted-foreground transition-all duration-200" />
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50 mt-auto pt-1 border-t border-border/50">
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3" />
            {mins} min read
          </span>
          <span>{date}</span>
          {!article.published && (
            <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Draft
            </span>
          )}
        </div>
      </Link>

      {hasActions && (
        <div className="flex items-center gap-1 border-t border-border/50 px-4 py-2 bg-muted/20">
          {onEdit && (
            <button
              onClick={() => onEdit(article)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <PencilSimpleIcon className="size-3.5" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(article)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <TrashIcon className="size-3.5" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
