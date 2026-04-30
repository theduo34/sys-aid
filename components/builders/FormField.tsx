import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  error,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={cn(
          'border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-1 focus:ring-ring',
          error && 'border-destructive'
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
