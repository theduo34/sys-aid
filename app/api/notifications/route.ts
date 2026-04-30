import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'

export async function POST(req: Request) {
  const auth = await requireRole(['student', 'staff', 'technician', 'admin'])
  if ('error' in auth) return auth.error

  const { type, ticketId, recipientEmail } = await req.json()

  if (!type || !ticketId || !recipientEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Resend integration — only runs if RESEND_API_KEY is configured
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ data: { queued: false, reason: 'No RESEND_API_KEY' } })
  }

  const subjects: Record<string, string> = {
    ticket_created:  'Your ticket has been received',
    ticket_assigned: 'A ticket has been assigned to you',
    status_changed:  'Your ticket status has changed',
    comment_added:   'A new comment on your ticket',
  }

  const subject = subjects[type] ?? 'SysAid notification'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SysAid <noreply@sysaid.example.com>',
      to: [recipientEmail],
      subject,
      html: `<p>${subject}. <a href="${appUrl}/tickets/${ticketId}">View ticket</a></p>`,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }

  return NextResponse.json({ data: { queued: true } })
}
