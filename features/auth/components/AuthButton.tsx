import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AuthButtonProps {
  isLoading: boolean
  disabled?: boolean
  label: string
  loadingLabel: string
  className?: string
}

export function AuthButton({ isLoading, disabled, label, loadingLabel, className }: AuthButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      className={cn('w-full h-11 rounded-lg text-sm font-medium', className)}
    >
      {isLoading ? loadingLabel : label}
    </Button>
  )
}
