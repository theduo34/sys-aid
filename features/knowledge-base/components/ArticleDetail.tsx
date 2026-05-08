'use client'

import { ClockIcon, CalendarDotsIcon, BookOpenIcon } from '@phosphor-icons/react'
import { useArticle } from '../hooks/useArticle'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

function readingTime(body: string): number {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200))
}

function renderBody(body: string) {
  return body.split(/\n{2,}/).filter(Boolean).map((block, i) => {
    const h1 = block.match(/^#\s+(.+)/)
    const h2 = block.match(/^##\s+(.+)/)
    const h3 = block.match(/^###\s+(.+)/)
    if (h1) return <h2 key={i} className="text-lg font-bold text-foreground mt-6 mb-1">{h1[1]}</h2>
    if (h2) return <h3 key={i} className="text-base font-semibold text-foreground mt-5 mb-1">{h2[1]}</h3>
    if (h3) return <h4 key={i} className="text-sm font-semibold text-foreground mt-4">{h3[1]}</h4>

    if (block.match(/^[-*]\s/m)) {
      const items = block.split('\n').filter((l) => l.match(/^[-*]\s/))
      return (
        <ul key={i} className="flex flex-col gap-1.5 pl-4 list-disc list-outside marker:text-muted-foreground/40">
          {items.map((item, j) => (
            <li key={j} className="text-sm text-muted-foreground leading-relaxed">
              {item.replace(/^[-*]\s/, '')}
            </li>
          ))}
        </ul>
      )
    }

    return (
      <p key={i} className="text-sm text-muted-foreground leading-7">
        {block.replace(/^#+\s+/, '')}
      </p>
    )
  })
}

interface ArticleDetailProps {
  slug: string
}

export function ArticleDetail({ slug }: ArticleDetailProps) {
  const { article, isLoading } = useArticle(slug)

  if (isLoading) return <LoadingSpinner />
  if (!article) return <p className="text-sm text-muted-foreground">Article not found.</p>

  const mins = readingTime(article.body ?? '')
  const date = new Date(article.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <article className="flex flex-col gap-6 max-w-2xl">
      {/* Header card */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-muted/70 via-card to-background p-6 flex flex-col gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background">
          <BookOpenIcon className="size-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground leading-snug">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDotsIcon className="size-3.5" />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="size-3.5" />
              {mins} min read
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="flex flex-col gap-3 px-1">
        {renderBody(article.body ?? '')}
      </div>
    </article>
  )
}
