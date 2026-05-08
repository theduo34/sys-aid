import Link from 'next/link'
import { ArrowLeftIcon, HeadsetIcon } from '@phosphor-icons/react/dist/ssr'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 48px),' +
            'repeating-linear-gradient(90deg, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 48px)',
        }}
      />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 size-64 rounded-full bg-foreground/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 size-48 rounded-full bg-foreground/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md">
        {/* Logo */}
        <div className="flex size-14 items-center justify-center rounded-2xl bg-foreground shadow-lg">
          <HeadsetIcon className="size-7 text-background" />
        </div>

        {/* 404 Number */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[8rem] font-bold leading-none tabular-nums text-foreground/10 select-none">
            404
          </span>
          <div className="-mt-8 flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeftIcon className="size-4" />
            Back to login
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            Go to dashboard
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          KTU SysAid · IT Help Desk
        </p>
      </div>
    </div>
  )
}
