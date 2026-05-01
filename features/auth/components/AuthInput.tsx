'use client'

import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  rightLabel?: React.ReactNode
}

export function AuthInput({ label, rightLabel, id, type, className, ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm text-foreground">
          {label}
        </label>
        {rightLabel}
      </div>
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={cn(
            'w-full rounded-lg bg-input border border-border px-3 py-2.5 text-sm text-foreground',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors',
            isPassword && 'pr-10',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        )}
      </div>
    </div>
  )
}
