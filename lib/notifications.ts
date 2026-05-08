import { createClient } from '@/lib/supabase/server'

interface NotificationParams {
  userId: string
  type:   string
  title:  string
  body:   string
  link?:  string | null
}

export async function createNotification(params: NotificationParams) {
  try {
    const supabase = await createClient()
    await supabase.rpc('create_notification', {
      p_user_id: params.userId,
      p_type:    params.type,
      p_title:   params.title,
      p_body:    params.body,
      p_link:    params.link ?? null,
    })
  } catch (err) {
    console.error('[notification] failed to create:', err)
  }
}
