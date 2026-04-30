'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const form = new FormData(e.currentTarget)

    const { error } = await supabase.auth.resetPasswordForEmail(
      form.get('email') as string,
      { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/update-password` }
    )

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset link sent — check your email.')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="email" type="email" placeholder="Email" required className="border border-border bg-background px-3 py-2 text-sm text-foreground" />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  )
}
