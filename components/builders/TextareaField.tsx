import { cn } from '@/lib/utils'

interface TextareaFieldProps {
  label: string
  name: string
  placeholder?: string
  required?: boolean
  rows?: number
  error?: string
  className?: string
}

export function TextareaField({
  label,
  name,
  placeholder,
  required,
  rows = 4,
  error,
  className,
}: TextareaFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={cn(
          'resize-y border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-1 focus:ring-ring',
          error && 'border-destructive'
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
