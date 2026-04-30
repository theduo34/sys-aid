import type { Metadata } from 'next'
import { KnowledgeBasePage } from '@/components/pages/knowledge-base/KnowledgeBasePage'

export const metadata: Metadata = {
  title: 'Knowledge Base',
  description: 'Browse IT help articles and FAQs',
}

export default function KnowledgeBaseRoute() {
  return <KnowledgeBasePage />
}
