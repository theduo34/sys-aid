import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

interface BroadcastParams {
  type:          string
  title:         string
  body:          string
  link?:         string | null
  excludeUserId?: string
}

export async function broadcastNotification(params: BroadcastParams) {
  try {
    const admin = createAdminClient()
    const { data: users } = await admin.from('profiles').select('id')

    await Promise.all(
      (users ?? [])
        .filter((u) => u.id !== params.excludeUserId)
        .map((u) =>
          admin.rpc('create_notification', {
            p_user_id: u.id,
            p_type:    params.type,
            p_title:   params.title,
            p_body:    params.body,
            p_link:    params.link ?? null,
          })
        )
    )
  } catch (err) {
    console.error('[notification] broadcast failed:', err)
  }
}
