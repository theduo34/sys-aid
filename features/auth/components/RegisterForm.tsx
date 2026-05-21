'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { AuthInput } from './AuthInput'
import { AuthButton } from './AuthButton'
import { SpinnerIcon, CheckCircleIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type Stage = 'form' | 'creating' | 'created'

function AccountStatus({ stage }: { stage: 'creating' | 'created' }) {
  const isDone = stage === 'created'

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className={cn(
        'relative flex size-20 items-center justify-center rounded-full border-2 transition-all duration-700',
        isDone
          ? 'border-primary/40 bg-primary/8'
          : 'border-muted-foreground/20'
      )}>
        {!isDone && (
          <div className="absolute inset-0 rounded-full border-2 border-t-muted-foreground/40 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        )}
        {isDone ? (
          <CheckCircleIcon className="size-9 text-primary animate-[scale-in_0.35s_ease-out]" />
        ) : (
          <SpinnerIcon className="size-8 text-muted-foreground animate-spin" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className={cn(
          'text-base font-semibold transition-all duration-300',
          isDone ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {isDone ? 'Account created!' : 'Creating your account…'}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isDone
            ? 'Taking you to email verification…'
            : 'Hang on, this will just take a second.'}
        </p>
      </div>

      {isDone && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SpinnerIcon className="size-3 animate-spin" />
          Redirecting…
        </div>
      )}
    </div>
  )
}

export function RegisterForm() {
  const router  = useRouter()
  const [stage,   setStage]   = useState<Stage>('form')
  const [email,   setEmail]   = useState('')
  const [isValid, setIsValid] = useState(false)

  function handleChange(e: React.FormEvent<HTMLFormElement>) {
    setIsValid(e.currentTarget.checkValidity())
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form     = new FormData(e.currentTarget)
    const emailVal = form.get('email') as string
    setEmail(emailVal)
    setStage('creating')

    const { error } = await supabase.auth.signUp({
      email:    emailVal,
      password: form.get('password') as string,
      options:  { data: { full_name: form.get('full_name') as string } },
    })

    if (error) {
      toast.error(error.message)
      setStage('form')
      return
    }

    // Brief pause so the "creating" animation is visible before switching to "created"
    await new Promise((r) => setTimeout(r, 900))
    setStage('created')

    // Navigate to verification after showing success state
    setTimeout(() => {
      router.push(`/verify?email=${encodeURIComponent(emailVal)}`)
    }, 1800)
  }

  if (stage !== 'form') return <AccountStatus stage={stage} />

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
        isLoading={false}
        disabled={!isValid}
        label="Create account"
        loadingLabel="Creating account…"
      />
    </form>
  )
}
