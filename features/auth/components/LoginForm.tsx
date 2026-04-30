'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const form = new FormData(e.currentTarget)

    const { error } = await supabase.auth.signInWithPassword({
      email: form.get('email') as string,
      password: form.get('password') as string,
    })

    if (error) {
      toast.error(error.message)
    } else {
      router.push('/dashboard')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="email" type="email" placeholder="Email" required className="border border-border bg-background px-3 py-2 text-sm text-foreground" />
      <input name="password" type="password" placeholder="Password" required className="border border-border bg-background px-3 py-2 text-sm text-foreground" />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
