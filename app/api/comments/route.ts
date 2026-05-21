import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'
import { createCommentSchema } from '@/lib/validations/comment'
import { can } from '@/lib/permissions'
import { z } from 'zod'

const bodySchema = createCommentSchema.extend({
  ticket_id: z.string().uuid('ticket_id must be a valid UUID'),
})

export async function POST(req: Request) {
  const auth = await requireRole(['student', 'staff', 'technician', 'admin'])
  if ('error' in auth) return auth.error

  const raw = await req.json()
  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { ticket_id, body, is_internal } = parsed.data

  if (is_internal && !can(auth.effectiveRole, 'comments:create:internal')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = await createClient()

  const { data: ticket } = await supabase
    .from('tickets')
    .select('created_by, assigned_to, title')
    .eq('id', ticket_id)
    .single()

  const { data, error } = await supabase
    .from('comments')
    .insert({ ticket_id, body, is_internal, author_id: auth.effectiveUserId })
    .select('*, author:profiles!author_id(id, full_name, role)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (ticket) {
    if (is_internal) {
      // Internal note: technician → notify all admins; admin → notify assigned technician
      if (auth.effectiveRole === 'technician') {
        const { data: admins } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')

        for (const admin of admins ?? []) {
          if (admin.id !== auth.effectiveUserId) {
            await createNotification({
              userId: admin.id,
              type:   'internal_note',
              title:  'Internal note added',
              body:   `On "${ticket.title}": ${body.slice(0, 100)}`,
              link:   `tickets/${ticket_id}`,
            })
          }
        }
      } else if (auth.effectiveRole === 'admin' && ticket.assigned_to && ticket.assigned_to !== auth.effectiveUserId) {
        await createNotification({
          userId: ticket.assigned_to,
          type:   'internal_note',
          title:  'New internal note on your ticket',
          body:   `On "${ticket.title}": ${body.slice(0, 100)}`,
          link:   `tickets/${ticket_id}`,
        })
      }
    } else {
      // Public comment: notify the other party in the conversation
      const isCreator = auth.effectiveUserId === ticket.created_by

      if (isCreator && ticket.assigned_to) {
        // Creator replied → notify assigned technician
        await createNotification({
          userId: ticket.assigned_to,
          type:   'comment_added',
          title:  'Customer replied on a ticket',
          body:   `"${ticket.title}": ${body.slice(0, 100)}`,
          link:   `tickets/${ticket_id}`,
        })
      } else if (!isCreator) {
        // Technician or admin commented → notify ticket creator
        await createNotification({
          userId: ticket.created_by,
          type:   'comment_added',
          title:  'New reply on your ticket',
          body:   body.slice(0, 120),
          link:   `tickets/${ticket_id}`,
        })
      }
    }
  }

  return NextResponse.json({ data }, { status: 201 })
}
