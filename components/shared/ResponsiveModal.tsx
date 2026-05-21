'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'

type ModalSize = 'default' | 'lg' | 'xl'

const sizeClass: Record<ModalSize, string> = {
  default: 'max-w-2xl',
  lg:      'max-w-3xl',
  xl:      'max-w-4xl',
}

interface ResponsiveModalProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
  title:        string
  description?: string
  size?:        ModalSize
  children:     React.ReactNode
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  size = 'default',
  children,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6 max-h-[92vh]">
          <DrawerHeader className="px-0">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          <div className="overflow-y-auto flex-1">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClass[size], 'max-h-[90vh] flex flex-col gap-0 p-0')}>
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
