import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/supabase/requireRole'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Admin can create technician or staff accounts directly.
// Students self-register. Admin accounts can only be created by other admins.
const ALLOWED_ROLES = ['technician', 'staff'] as const
type AllowedRole = (typeof ALLOWED_ROLES)[number]

function randomPassword() {
  const lower = Math.random().toString(36).slice(2, 10)
  const upper = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${lower}${upper}!`
}

export async function POST(req: Request) {
  const auth = await requireRole(['admin'])
  if ('error' in auth) return auth.error

  const { email, full_name, role } = await req.json()

  if (!email || !full_name || !ALLOWED_ROLES.includes(role)) {
    return NextResponse.json(
      { error: `email, full_name, and role (${ALLOWED_ROLES.join(' | ')}) are required` },
      { status: 400 }
    )
  }

  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const tempPassword = randomPassword()

  const { data: authUser, error: createError } = await serviceClient.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name },
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  // DB trigger creates profile with role='student' — update to the intended role
  const supabase = createClient()
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: role as AllowedRole, full_name })
    .eq('id', authUser.user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ data: { userId: authUser.user.id, tempPassword } }, { status: 201 })
}
