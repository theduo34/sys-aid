'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const form = new FormData(e.currentTarget)

    const { error } = await supabase.auth.signUp({
      email: form.get('email') as string,
      password: form.get('password') as string,
      options: {
        data: { full_name: form.get('full_name') as string },
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Check your email to confirm your account.')
      router.push('/login')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="full_name" type="text" placeholder="Full name" required className="border border-border bg-background px-3 py-2 text-sm text-foreground" />
      <input name="email" type="email" placeholder="University email" required className="border border-border bg-background px-3 py-2 text-sm text-foreground" />
      <input name="password" type="password" placeholder="Password (min 8 characters)" minLength={8} required className="border border-border bg-background px-3 py-2 text-sm text-foreground" />
      <p className="text-xs text-muted-foreground">
        All new accounts start as student. Lecturers and staff can request a role upgrade after signing in.
      </p>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
