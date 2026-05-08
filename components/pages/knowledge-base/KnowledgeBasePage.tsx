'use client'

import { useState } from 'react'
import { ArticleList } from '@/features/knowledge-base/components/ArticleList'
import { ArticleForm } from '@/features/knowledge-base/components/ArticleForm'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/shared/ResponsiveModal'
import { PlusIcon } from '@phosphor-icons/react'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { useArticles } from '@/features/knowledge-base/hooks/useArticles'

export function KnowledgeBasePage() {
  const canWrite = usePermission('kb:write')
  const { refetch } = useArticles()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Browse IT guides and frequently asked questions.</p>
        {canWrite && (
          <Button size="sm" onClick={() => setOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            New article
          </Button>
        )}
      </div>

      <ArticleList />

      {canWrite && (
        <ResponsiveModal
          open={open}
          onOpenChange={setOpen}
          title="New Article"
          description="Write a knowledge base article in Markdown."
        >
          <ArticleForm
            onSaved={() => { setOpen(false); refetch() }}
          />
        </ResponsiveModal>
      )}
    </div>
  )
}
