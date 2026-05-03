import type { Metadata } from 'next'
import { ArticleDetail } from '@/features/knowledge-base/components/ArticleDetail'

export const metadata: Metadata = { title: 'Article' }

export default async function ArticleRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ArticleDetail slug={slug} />
}
