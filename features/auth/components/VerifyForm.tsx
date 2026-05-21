'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { SpinnerIcon, CheckCircleIcon, EnvelopeIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Stage = 'form' | 'verifying' | 'verified'

const CODE_LENGTH = 8

function VerifyStatus({ stage }: { stage: 'verifying' | 'verified' }) {
  const isDone = stage === 'verified'
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className={cn(
        'relative flex size-20 items-center justify-center rounded-full border-2 transition-all duration-700',
        isDone ? 'border-primary/40 bg-primary/8' : 'border-muted-foreground/20'
      )}>
        {!isDone && (
          <div className="absolute inset-0 rounded-full border-2 border-t-muted-foreground/40 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        )}
        {isDone
          ? <CheckCircleIcon className="size-9 text-primary" />
          : <SpinnerIcon className="size-8 text-muted-foreground animate-spin" />
        }
      </div>
      <div className="flex flex-col gap-2">
        <p className={cn('text-base font-semibold transition-all duration-300', isDone ? 'text-foreground' : 'text-muted-foreground')}>
          {isDone ? 'Email verified!' : 'Verifying your email…'}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isDone ? 'Your account is ready. Taking you to sign in…' : 'Checking your code, one moment.'}
        </p>
      </div>
      {isDone && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SpinnerIcon className="size-3 animate-spin" />
          Redirecting to login…
        </div>
      )}
    </div>
  )
}

interface OTPInputProps {
  value:    string[]
  onChange: (next: string[]) => void
  disabled: boolean
}

function OTPInput({ value, onChange, disabled }: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(idx: number, raw: string) {
    if (!/^\d*$/.test(raw)) return
    const digit = raw.slice(-1)
    const next  = [...value]
    next[idx]   = digit
    onChange(next)
    if (digit && idx < CODE_LENGTH - 1) refs.current[idx + 1]?.focus()
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) refs.current[idx - 1]?.focus()
    if (e.key === 'ArrowLeft'  && idx > 0)               refs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < CODE_LENGTH - 1) refs.current[idx + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((d, i) => { next[i] = d })
    onChange(next)
    refs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  return (
    <div className="flex items-center gap-2 justify-center" onPaste={handlePaste}>
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { refs.current[idx] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onFocus={(e) => e.target.select()}
          className={cn(
            'size-11 rounded-lg border text-center text-lg font-semibold font-mono',
            'bg-background text-foreground transition-all',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
            digit ? 'border-primary/60 bg-primary/5' : 'border-border',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
      ))}
    </div>
  )
}

interface VerifyFormProps {
  email: string
}

export function VerifyForm({ email }: VerifyFormProps) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [stage,     setStage]     = useState<Stage>('form')
  const [digits,    setDigits]    = useState(Array(CODE_LENGTH).fill(''))
  const [resending, setResending] = useState(false)

  // Auto-fill from URL ?code= param (set by the email deep-link button)
  useEffect(() => {
    const urlCode = searchParams.get('code')?.replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (urlCode && urlCode.length === CODE_LENGTH) {
      setDigits(urlCode.split(''))
    }
  }, [searchParams])

  const code     = digits.join('')
  const isFilled = code.length === CODE_LENGTH

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!isFilled) return
    setStage('verifying')

    const res  = await fetch('/api/auth/verify-otp', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, code }),
    })
    const json = await res.json()

    if (!res.ok) {
      toast.error(json.error ?? 'Invalid or expired code. Please try again.')
      setDigits(Array(CODE_LENGTH).fill(''))
      setStage('form')
      return
    }

    setStage('verified')
    toast.success('Email verified! You can now sign in.')
    setTimeout(() => router.push('/login'), 2200)
  }

  async function handleResend() {
    const { createBrowserClient } = await import('@supabase/ssr')
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    setResending(true)
    const { error } = await sb.auth.resend({ type: 'signup', email })
    if (error) {
      toast.error(error.message ?? 'Could not resend code.')
    } else {
      toast.success('A new 8-digit code has been sent to your email.')
      setDigits(Array(CODE_LENGTH).fill(''))
    }
    setResending(false)
  }

  if (stage !== 'form') return <VerifyStatus stage={stage} />

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
        <EnvelopeIcon className="size-4 shrink-0 text-muted-foreground" />
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[11px] text-muted-foreground">Code sent to</span>
          <span className="text-xs font-medium text-foreground truncate">{email}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <OTPInput value={digits} onChange={setDigits} disabled={stage !== 'form'} />
        <p className="text-center text-xs text-muted-foreground">
          Enter the 8-digit code from your email
        </p>
      </div>

      <Button type="submit" disabled={!isFilled} className="w-full">
        Verify email
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <span>Didn&apos;t receive a code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-foreground underline underline-offset-4 hover:opacity-75 transition-opacity disabled:opacity-50"
        >
          {resending ? 'Sending…' : 'Resend'}
        </button>
      </div>
    </form>
  )
}
