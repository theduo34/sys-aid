import type { Metadata } from 'next'
import { KnowledgeBasePage } from '@/components/pages/knowledge-base/KnowledgeBasePage'

export const metadata: Metadata = { title: 'Knowledge Base' }

export default function KnowledgeBaseRoute() {
  return <KnowledgeBasePage />
}
