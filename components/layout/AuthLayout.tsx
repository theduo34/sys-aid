import Link from 'next/link'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr'

interface AuthLayoutProps {
  heading: string
  subtext: string
  subtextLink: { label: string; href: string }
  children: React.ReactNode
}

interface CornerDecorationProps {
  position: 'top-right' | 'bottom-left'
  width: string
  height: string
}

function CornerDecoration({ position, width, height }: CornerDecorationProps) {
  const isTopRight = position === 'top-right'
  const at = isTopRight ? 'top right' : 'bottom left'
  const placement = isTopRight ? '-top-20 -right-20' : '-bottom-20 -left-20'

  return (
    <div
      className={`absolute pointer-events-none ${placement}`}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${at}, oklch(0.78 0 0) 0%, oklch(0.55 0 0) 22%, oklch(0.32 0 0) 45%, oklch(0.18 0 0) 65%, transparent 80%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'repeating-linear-gradient(45deg,  oklch(1 0 0 / 60%) 0px, oklch(1 0 0 / 60%) 1px, transparent 1px, transparent 14px)',
            'repeating-linear-gradient(-45deg, oklch(1 0 0 / 60%) 0px, oklch(1 0 0 / 60%) 1px, transparent 1px, transparent 14px)',
          ].join(','),
          maskImage: `radial-gradient(ellipse at ${at}, black 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.2) 55%, transparent 72%)`,
          WebkitMaskImage: `radial-gradient(ellipse at ${at}, black 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.2) 55%, transparent 72%)`,
        }}
      />
    </div>
  )
}

export function AuthLayout({ heading, subtext, subtextLink, children }: AuthLayoutProps) {
  return (
    <div className="dark">
      <div className="relative min-h-screen overflow-hidden bg-background font-sans flex flex-col items-center justify-center px-4 py-16">

        <Link
          href="/"
          className="absolute top-5 left-5 z-20 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="size-3.5" />
          Home
        </Link>

        <CornerDecoration position="top-right" width="54vw" height="82vh" />

        <CornerDecoration position="bottom-left" width="42vw" height="58vh" />

        <div className="relative z-10 w-full max-w-md flex flex-col gap-8">

          <div className="flex flex-col items-center gap-5">
            <div className="size-10 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-foreground tracking-tighter">SA</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
                {heading}
              </h1>
              <p className="text-sm text-muted-foreground">
                {subtext}{' '}
                <Link
                  href={subtextLink.href}
                  className="text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {subtextLink.label}
                </Link>
              </p>
            </div>
          </div>

          {children}

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms and Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  )
}
