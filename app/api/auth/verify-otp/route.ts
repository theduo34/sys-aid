import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

function hashCode(code: string, email: string): string {
  // One-way SHA-256 hash — the plain-text code is never stored
  return createHash('sha256').update(code + email.toLowerCase()).digest('hex')
}

export async function POST(req: Request) {
  const { email, code } = await req.json()

  if (!email || !code || typeof code !== 'string' || code.length !== 8) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Verify the OTP with Supabase Auth
  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type:  'signup',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // OTP confirmed — store the irreversible hash as an audit record
  const admin = createAdminClient()
  await admin.from('verification_codes').insert({
    email,
    code_hash: hashCode(code, email),
  })

  return NextResponse.json({ ok: true })
}
