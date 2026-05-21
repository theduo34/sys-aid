'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ClockIcon,
  CalendarDotsIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useArticle } from '../hooks/useArticle'
import { ArticleForm } from './ArticleForm'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ResponsiveModal } from '@/components/shared/ResponsiveModal'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { useBasePath } from '@/hooks/useBasePath'

function readingTime(body: string): number {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200))
}

function renderInline(text: string, prefix: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**'))
      return <strong key={`${prefix}-${i}`} className="font-semibold text-foreground">{seg.slice(2, -2)}</strong>
    if (seg.startsWith('*') && seg.endsWith('*'))
      return <em key={`${prefix}-${i}`}>{seg.slice(1, -1)}</em>
    if (seg.startsWith('`') && seg.endsWith('`'))
      return (
        <code key={`${prefix}-${i}`} className="rounded bg-muted px-1 py-0.5 text-[0.8em] font-mono text-foreground">
          {seg.slice(1, -1)}
        </code>
      )
    return seg
  })
}

function renderBody(body: string): React.ReactNode[] {
  const blocks = body.split(/\n{2,}/).filter(Boolean)
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    // Fenced code block
    if (block.startsWith('```')) {
      const lines = block.split('\n')
      const code  = lines.slice(1).filter((l) => l !== '```').join('\n')
      nodes.push(
        <pre key={i} className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs leading-relaxed font-mono">
          <code>{code}</code>
        </pre>
      )
      i++; continue
    }

    // Horizontal rule
    if (/^---+$/.test(block.trim())) {
      nodes.push(<hr key={i} className="border-border my-2" />)
      i++; continue
    }

    // Headings
    const h1 = block.match(/^#\s+(.+)/)
    const h2 = block.match(/^##\s+(.+)/)
    const h3 = block.match(/^###\s+(.+)/)
    if (h1) {
      nodes.push(
        <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-2 first:mt-0">
          {renderInline(h1[1], `h1-${i}`)}
        </h2>
      )
      i++; continue
    }
    if (h2) {
      nodes.push(
        <h3 key={i} className="text-base font-semibold text-foreground mt-6 mb-1.5">
          {renderInline(h2[1], `h2-${i}`)}
        </h3>
      )
      i++; continue
    }
    if (h3) {
      nodes.push(
        <h4 key={i} className="text-sm font-semibold text-foreground mt-5 mb-1">
          {renderInline(h3[1], `h3-${i}`)}
        </h4>
      )
      i++; continue
    }

    // Blockquote
    if (block.startsWith('> ')) {
      const text = block.replace(/^>\s*/gm, '')
      nodes.push(
        <blockquote key={i} className="border-l-4 border-primary/40 bg-muted/40 rounded-r-md pl-4 pr-3 py-2.5">
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            {renderInline(text, `bq-${i}`)}
          </p>
        </blockquote>
      )
      i++; continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(block)) {
      const items = block.split('\n').filter((l) => /^\d+\.\s/.test(l))
      nodes.push(
        <ol key={i} className="flex flex-col gap-1.5 pl-5 list-decimal list-outside marker:text-muted-foreground/60">
          {items.map((item, j) => (
            <li key={j} className="text-sm text-muted-foreground leading-relaxed pl-1">
              {renderInline(item.replace(/^\d+\.\s/, ''), `ol-${i}-${j}`)}
            </li>
          ))}
        </ol>
      )
      i++; continue
    }

    // Unordered list
    if (/^[-*]\s/.test(block)) {
      const items = block.split('\n').filter((l) => /^[-*]\s/.test(l))
      nodes.push(
        <ul key={i} className="flex flex-col gap-1.5 pl-5 list-disc list-outside marker:text-muted-foreground/40">
          {items.map((item, j) => (
            <li key={j} className="text-sm text-muted-foreground leading-relaxed pl-1">
              {renderInline(item.replace(/^[-*]\s/, ''), `ul-${i}-${j}`)}
            </li>
          ))}
        </ul>
      )
      i++; continue
    }

    // Plain paragraph
    nodes.push(
      <p key={i} className="text-sm text-muted-foreground leading-7">
        {renderInline(block.replace(/^#+\s+/, ''), `p-${i}`)}
      </p>
    )
    i++
  }

  return nodes
}

interface ArticleDetailProps {
  slug: string
}

export function ArticleDetail({ slug }: ArticleDetailProps) {
  const { article, isLoading, refetch } = useArticle(slug)
  const canWrite = usePermission('kb:write')
  const base     = useBasePath()
  const router   = useRouter()
  const [editOpen,    setEditOpen]    = useState(false)
  const [deleteOpen,  setDeleteOpen]  = useState(false)
  const [isDeleting,  setIsDeleting]  = useState(false)

  async function handleDelete() {
    if (!article) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/knowledge-base/${article.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Article deleted.')
        router.push(`${base}/knowledge-base`)
      } else {
        toast.error('Failed to delete article.')
        setDeleteOpen(false)
      }
    } catch {
      toast.error('Something went wrong.')
      setDeleteOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl w-full flex flex-col gap-6">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="rounded-2xl border border-border bg-card p-8 flex flex-col gap-4">
          <Skeleton className="h-7 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
        <div className="flex flex-col gap-3 px-1">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4 w-full rounded" />)}
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-2xl w-full flex flex-col gap-4">
        <button
          onClick={() => router.push(`${base}/knowledge-base`)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to Knowledge Base
        </button>
        <p className="text-sm text-muted-foreground">Article not found.</p>
      </div>
    )
  }

  const mins = readingTime(article.body ?? '')
  const date = new Date(article.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const updatedDate = article.updated_at !== article.created_at
    ? new Date(article.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <>
      <article className="mx-auto max-w-2xl w-full flex flex-col gap-6">
        {/* Top navigation */}
        <div className="flex items-center justify-between gap-4 py-1">
         <div/>

          {canWrite && (
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
                <PencilSimpleIcon data-icon="inline-start" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeleteOpen(true)}
                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              >
                <TrashIcon data-icon="inline-start" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Header card */}
        <header className="rounded-2xl border border-border bg-gradient-to-br from-muted/60 via-card to-background px-8 py-8 flex flex-col gap-6">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
            <BookOpenIcon className="size-6 text-primary" />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground leading-snug">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
              <span className="flex items-center gap-1.5">
                <CalendarDotsIcon className="size-3.5" />
                Published {date}
              </span>
              {updatedDate && (
                <span className="flex items-center gap-1.5">
                  · Updated {updatedDate}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <ClockIcon className="size-3.5" />
                {mins} min read
              </span>
              {!article.published && (
                <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-[10px] font-semibold text-warning-foreground">
                  Draft — not visible to users
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Article body */}
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card px-7 py-8 pb-12">
          {renderBody(article.body ?? '')}
        </div>
      </article>

      {/* Edit modal */}
      <ResponsiveModal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Article"
        description="Update the knowledge base article."
        size="xl"
      >
        <ArticleForm
          article={article}
          onSaved={() => { setEditOpen(false); refetch() }}
        />
      </ResponsiveModal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteOpen}
        title={`Delete "${article.title}"?`}
        description="This article will be permanently removed and cannot be recovered."
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
