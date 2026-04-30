import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  name: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  error?: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
}

export function SelectField({
  label,
  name,
  options,
  placeholder,
  required,
  error,
  defaultValue,
  onChange,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'border border-border bg-background px-3 py-2 text-sm text-foreground',
          'focus:outline-none focus:ring-1 focus:ring-ring',
          error && 'border-destructive'
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
