import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { broadcastNotification } from '@/lib/notifications'

export async function POST(req: Request) {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const { title, body, published } = await req.json()

  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 })
  }

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 80)

  const supabase = await createClient()

  const { data: article, error } = await supabase
    .from('knowledge_articles')
    .insert({ title, slug, body, published: !!published, created_by: auth.user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (published && article) {
    await broadcastNotification({
      type:          'kb_article',
      title:         'New Knowledge Base article',
      body:          `"${article.title}" is now available in the Knowledge Base.`,
      link:          `knowledge-base/${article.slug}`,
      excludeUserId: auth.user.id,
    })
  }

  return NextResponse.json({ data: article }, { status: 201 })
}
