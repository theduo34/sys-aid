'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AuthInput } from './AuthInput'
import { AuthButton } from './AuthButton'

export function LoginForm() {
  const router = useRouter()
  const { user, profile, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)

  // If this tab already completed login (has the sessionStorage marker), go to dashboard
  useEffect(() => {
    if (authLoading) return
    if (user && profile && sessionStorage.getItem('sysaid_tab')) {
      router.replace(`/${profile.role}/${user.id}/dashboard`)
    }
  }, [authLoading, user, profile, router])

  function handleChange(e: React.FormEvent<HTMLFormElement>) {
    setIsValid(e.currentTarget.checkValidity())
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const form = new FormData(e.currentTarget)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.get('email') as string,
      password: form.get('password') as string,
    })

    if (error || !data.user) {
      toast.error(error?.message ?? 'Sign in failed.')
      setIsLoading(false)
      return
    }

    // Fetch the user's role to build the correct role-based URL
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!profile) {
      toast.error('Could not load your profile. Please try again.')
      setIsLoading(false)
      return
    }

    router.push(`/${profile.role}/${data.user.id}/dashboard`)
  }

  return (
    <form onSubmit={handleSubmit} onChange={handleChange} className="flex flex-col gap-4">
      <AuthInput
        id="login-email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@ktu.edu.gh"
        required
      />
      <AuthInput
        id="login-password"
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        rightLabel={
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot your password?
          </Link>
        }
      />
      <AuthButton
        className="mt-2"
        isLoading={isLoading}
        disabled={!isValid}
        label="Sign in"
        loadingLabel="Signing in…"
      />
    </form>
  )
}
