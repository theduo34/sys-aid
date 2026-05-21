'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ArticleList } from '@/features/knowledge-base/components/ArticleList'
import { ArticleForm } from '@/features/knowledge-base/components/ArticleForm'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/shared/ResponsiveModal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PlusIcon } from '@phosphor-icons/react'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { useArticles } from '@/features/knowledge-base/hooks/useArticles'
import type { KnowledgeArticle } from '@/types/types_db'

export function KnowledgeBasePage() {
  const canWrite = usePermission('kb:write')
  const { articles, isLoading, isLoadingMore, hasMore, loadMore, refetch } = useArticles()

  const [createOpen,  setCreateOpen]  = useState(false)
  const [editArticle, setEditArticle] = useState<KnowledgeArticle | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeArticle | null>(null)
  const [isDeleting, setIsDeleting]   = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/knowledge-base/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Article deleted.')
        setDeleteTarget(null)
        refetch()
      } else {
        const json = await res.json()
        toast.error(json.error ?? 'Failed to delete article.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Browse IT guides and frequently asked questions.</p>
        {canWrite && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            New article
          </Button>
        )}
      </div>

      <ArticleList
        articles={articles}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onEdit={canWrite ? setEditArticle : undefined}
        onDelete={canWrite ? setDeleteTarget : undefined}
      />

      {/* Create modal */}
      <ResponsiveModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="New Article"
        description="Write a knowledge base article in Markdown."
        size="xl"
      >
        <ArticleForm
          onSaved={() => { setCreateOpen(false); refetch() }}
        />
      </ResponsiveModal>

      {/* Edit modal */}
      <ResponsiveModal
        open={!!editArticle}
        onOpenChange={(open) => { if (!open) setEditArticle(null) }}
        title="Edit Article"
        description="Update the knowledge base article."
        size="xl"
      >
        {editArticle && (
          <ArticleForm
            article={editArticle}
            onSaved={() => { setEditArticle(null); refetch() }}
          />
        )}
      </ResponsiveModal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title ?? 'this article'}"?`}
        description="This article will be permanently removed. This cannot be undone."
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
