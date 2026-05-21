import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { broadcastNotification } from '@/lib/notifications'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const { id } = await params
  const { title, body, published } = await req.json()

  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('knowledge_articles')
    .select('published, slug, title')
    .eq('id', id)
    .single()

  const { data: article, error } = await supabase
    .from('knowledge_articles')
    .update({ title, body, published: !!published })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (published && article) {
    const isNewlyPublished = !existing?.published
    await broadcastNotification({
      type:          'kb_article',
      title:         isNewlyPublished ? 'New Knowledge Base article' : 'Knowledge Base article updated',
      body:          `"${article.title}" has been ${isNewlyPublished ? 'published' : 'updated'}.`,
      link:          `knowledge-base/${article.slug}`,
      excludeUserId: auth.user.id,
    })
  }

  return NextResponse.json({ data: article })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const { id } = await params
  const supabase = await createClient()

  const { error } = await supabase
    .from('knowledge_articles')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
