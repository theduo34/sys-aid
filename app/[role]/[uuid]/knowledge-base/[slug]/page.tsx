import type { Metadata } from 'next'
import { ArticleDetail } from '@/features/knowledge-base/components/ArticleDetail'

export const metadata: Metadata = { title: 'Article' }

export default function ArticleRoute({ params }: { params: { slug: string } }) {
  return <ArticleDetail slug={params.slug} />
}
