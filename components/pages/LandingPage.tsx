import Link from 'next/link'
import {
  HeadsetIcon,
  TicketIcon,
  ClockCountdownIcon,
  BookOpenIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react/dist/ssr'

const FEATURES = [
  {
    icon: TicketIcon,
    title: 'Submit in seconds',
    description:
      'File an IT support request from any device. Describe your issue, attach a file, and a technician is notified instantly.',
  },
  {
    icon: ClockCountdownIcon,
    title: 'Real-time tracking',
    description:
      'Watch your ticket move from open → assigned → resolved. SLA countdowns keep technicians accountable.',
  },
  {
    icon: BookOpenIcon,
    title: 'Self-service knowledge base',
    description:
      'Browse IT guides and FAQs before raising a ticket. Most common issues are already answered.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Role-based access',
    description:
      'Students, lecturers, technicians, and admins each see exactly what they need — nothing more.',
  },
  {
    icon: UsersThreeIcon,
    title: 'Smart assignment',
    description:
      'Tickets are automatically routed to the technician in the matching department with the lightest workload.',
  },
  {
    icon: HeadsetIcon,
    title: 'Built for KTU',
    description:
      "Designed around how Koforidua Technical University's IT team actually works — not a generic enterprise tool.",
  },
]

const STATS = [
  { value: '< 4 hr', label: 'Avg. response time' },
  { value: '97%',    label: 'SLA compliance'      },
  { value: '5',      label: 'Departments served'  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-foreground shrink-0">
              <HeadsetIcon className="size-4 text-background" />
            </div>
            <span className="font-semibold text-sm tracking-tight">SysAid</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-background hover:opacity-85 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 sm:py-40">
          {/* Subtle grid backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,var(--foreground) 0,var(--foreground) 1px,transparent 1px,transparent 48px),' +
                'repeating-linear-gradient(90deg,var(--foreground) 0,var(--foreground) 1px,transparent 1px,transparent 48px)',
            }}
          />
          {/* Glow blobs */}
          <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-foreground/[0.03] blur-3xl" />

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center flex flex-col items-center gap-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <CheckCircleIcon className="size-3" />
              Koforidua Technical University · IT Services
            </span>

            <h1 className="text-4xl font-bold tracking-tight sm:text-[64px] leading-[1.08]">
              Campus IT support,
              <br />
              <span className="text-muted-foreground">actually simple.</span>
            </h1>

            <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
              Submit tickets, track resolutions in real time, and find answers in the
              knowledge base — one platform for every KTU student, lecturer, and IT
              technician.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-85 transition-opacity"
              >
                Submit a ticket
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────── */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
            <div className="grid grid-cols-3 gap-6 text-center">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <span className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────── */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col gap-14">
            <div className="text-center flex flex-col gap-3 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Everything the campus needs
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Designed around real KTU workflows — from first-year students to
                the IT admin team.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group rounded-xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-foreground/20 transition-colors"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted group-hover:bg-foreground/5 transition-colors">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="border-t border-border py-24 sm:py-32">
          <div className="mx-auto max-w-lg px-4 sm:px-6 text-center flex flex-col items-center gap-8">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-foreground shadow-sm">
              <HeadsetIcon className="size-7 text-background" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Having an IT issue?
              </h2>
              <p className="text-sm text-muted-foreground">
                Create an account and submit a ticket in under a minute. Our
                technicians are ready to help.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-7 py-3.5 text-sm font-semibold text-background hover:opacity-85 transition-opacity"
            >
              Get started — it&apos;s free
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Koforidua Technical University · IT Services
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
