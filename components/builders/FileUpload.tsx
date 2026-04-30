'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { UploadSimpleIcon, XIcon } from '@phosphor-icons/react'

interface FileUploadProps {
  name: string
  label: string
  accept?: string
  onFileSelect?: (file: File | null) => void
  className?: string
}

export function FileUpload({ name, label, accept, onFileSelect, className }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setFileName(file?.name ?? null)
    onFileSelect?.(file)
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = ''
    setFileName(null)
    onFileSelect?.(null)
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          <UploadSimpleIcon className="size-4" />
          {fileName ?? 'Choose file'}
        </button>
        {fileName && (
          <button type="button" onClick={handleClear} className="text-muted-foreground hover:text-foreground">
            <XIcon className="size-4" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  )
}
