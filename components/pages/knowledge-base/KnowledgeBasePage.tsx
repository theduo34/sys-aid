import { ArticleList } from '@/features/knowledge-base/components/ArticleList'
import { PageHeader } from '@/components/shared/PageHeader'

export function KnowledgeBasePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Knowledge Base" />
      <ArticleList />
    </div>
  )
}
