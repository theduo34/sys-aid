'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { AuthInput } from './AuthInput'
import { AuthButton } from './AuthButton'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [sent, setSent] = useState(false)

  function handleChange(e: React.FormEvent<HTMLFormElement>) {
    setIsValid(e.currentTarget.checkValidity())
  }

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
      setSent(true)
    }

    setIsLoading(false)
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-3 text-center py-2">
        <p className="text-sm font-medium text-foreground">Check your email</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          If that address is registered, you&apos;ll receive a reset link shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} onChange={handleChange} className="flex flex-col gap-4">
      <AuthInput
        id="reset-email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@ktu.edu.gh"
        required
      />
      <AuthButton
        className="mt-1"
        isLoading={isLoading}
        disabled={!isValid}
        label="Send reset link"
        loadingLabel="Sending…"
      />
    </form>
  )
}
