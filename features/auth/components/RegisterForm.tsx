'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { AuthInput } from './AuthInput'
import { AuthButton } from './AuthButton'

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)

  function handleChange(e: React.FormEvent<HTMLFormElement>) {
    setIsValid(e.currentTarget.checkValidity())
  }

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
    <form onSubmit={handleSubmit} onChange={handleChange} className="flex flex-col gap-4">
      <AuthInput
        id="reg-name"
        label="Full name"
        name="full_name"
        type="text"
        autoComplete="name"
        placeholder="Kwame Mensah"
        required
      />
      <AuthInput
        id="reg-email"
        label="University email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@ktu.edu.gh"
        required
      />
      <AuthInput
        id="reg-password"
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        placeholder="Min. 8 characters"
        required
      />
      <p className="text-xs text-muted-foreground leading-relaxed">
        All accounts start as <strong className="text-foreground font-medium">student</strong>.
        Lecturers and staff can request an upgrade after signing in.
      </p>
      <AuthButton
        isLoading={isLoading}
        disabled={!isValid}
        label="Create account"
        loadingLabel="Creating account…"
      />
    </form>
  )
}
