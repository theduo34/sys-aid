'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  HeadsetIcon,
  TicketIcon,
  ClockCountdownIcon,
  BookOpenIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  UsersThreeIcon,
  LightningIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react'

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const staggerSlow = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

// ── Feature cards ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon:        TicketIcon,
    title:       'Submit in seconds',
    description: 'File an IT support request from any device. Describe your issue, attach a file, and a technician is notified instantly.',
    accent:      'bg-destructive/10 text-destructive',
    border:      'hover:border-destructive/30',
  },
  {
    icon:        ClockCountdownIcon,
    title:       'Real-time tracking',
    description: 'Watch your ticket move from open → resolved. SLA countdowns keep technicians accountable.',
    accent:      'bg-warning/20 text-warning-foreground',
    border:      'hover:border-warning/40',
  },
  {
    icon:        BookOpenIcon,
    title:       'Knowledge base',
    description: 'Browse IT guides and FAQs before raising a ticket. Most common issues are already answered.',
    accent:      'bg-primary/10 text-primary',
    border:      'hover:border-primary/20',
  },
  {
    icon:        ShieldCheckIcon,
    title:       'Role-based access',
    description: 'Students, lecturers, technicians, and admins each see exactly what they need — nothing more.',
    accent:      'bg-destructive/10 text-destructive',
    border:      'hover:border-destructive/30',
  },
  {
    icon:        UsersThreeIcon,
    title:       'Smart assignment',
    description: 'Tickets are automatically routed to the technician in the matching department with the lightest workload.',
    accent:      'bg-warning/20 text-warning-foreground',
    border:      'hover:border-warning/40',
  },
  {
    icon:        HeadsetIcon,
    title:       'Built for KTU',
    description: "Designed around how Koforidua Technical University's IT team actually works — not a generic enterprise tool.",
    accent:      'bg-primary/10 text-primary',
    border:      'hover:border-primary/20',
  },
]

const STATS = [
  { value: '< 4 hr', label: 'Avg. response time', color: 'border-l-destructive' },
  { value: '97%',    label: 'SLA compliance',      color: 'border-l-warning'     },
  { value: '5',      label: 'Departments served',  color: 'border-l-primary'     },
]

// ── Component ─────────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-foreground shrink-0">
              <HeadsetIcon className="size-4 text-background" />
            </div>
            <span className="font-semibold text-sm tracking-tight">SysAid</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
      </motion.nav>

      <main className="flex-1">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 sm:py-40">
          {/* Coloured glow blobs */}
          <div aria-hidden className="pointer-events-none absolute -top-32 -left-20 size-[480px] rounded-full bg-destructive/[0.08] blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute top-10 -right-24 size-[400px] rounded-full bg-warning/[0.12] blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-primary/[0.04] blur-3xl" />

          {/* Grid texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,var(--foreground) 0,var(--foreground) 1px,transparent 1px,transparent 48px),' +
                'repeating-linear-gradient(90deg,var(--foreground) 0,var(--foreground) 1px,transparent 1px,transparent 48px)',
            }}
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center flex flex-col items-center gap-8"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning-foreground"
            >
              <LightningIcon className="size-3" weight="fill" />
              Koforidua Technical University · IT Services
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold tracking-tight sm:text-[62px] leading-[1.07]"
            >
              Campus IT support,
              <br />
              <span
                className="bg-gradient-to-r from-destructive to-warning bg-clip-text text-transparent"
              >
                actually simple.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-lg text-base text-muted-foreground leading-relaxed"
            >
              Submit tickets, track resolutions in real time, and find answers in
              the knowledge base — one platform for every KTU student, lecturer,
              and IT technician.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-3"
            >
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
            </motion.div>
          </motion.div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────────────── */}
        <section className="border-y border-border bg-muted/20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-3 gap-6"
            >
              {STATS.map(({ value, label, color }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className={`flex flex-col gap-2 border-l-2 pl-4 sm:pl-5 ${color}`}
                >
                  <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight text-foreground">
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col gap-14">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="text-center flex flex-col gap-3 max-w-lg mx-auto"
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold tracking-tight sm:text-3xl">
                Everything the campus needs
              </motion.h2>
              <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed">
                Designed around real KTU workflows — from first-year students to the IT admin team.
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {FEATURES.map(({ icon: Icon, title, description, accent, border }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className={`group rounded-xl border border-border bg-card p-6 flex flex-col gap-4 ${border} transition-colors duration-200`}
                >
                  <div className={`flex size-9 items-center justify-center rounded-lg ${accent}`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-border py-24 sm:py-32">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-warning/[0.07] via-background to-destructive/[0.06]" />
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[400px] rounded-full bg-warning/[0.1] blur-3xl" />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative mx-auto max-w-lg px-4 sm:px-6 text-center flex flex-col items-center gap-8"
          >
            <motion.div
              variants={fadeUp}
              className="flex size-14 items-center justify-center rounded-2xl bg-foreground shadow-md"
            >
              <HeadsetIcon className="size-7 text-background" />
            </motion.div>

            <motion.div variants={stagger} className="flex flex-col gap-2">
              <motion.h2 variants={fadeUp} className="text-2xl font-bold tracking-tight sm:text-3xl">
                Having an IT issue?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-sm text-muted-foreground">
                Create an account and submit a ticket in under a minute. Our technicians are ready to help.
              </motion.p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-7 py-3.5 text-sm font-semibold text-background hover:opacity-85 transition-opacity"
              >
                Get started — it&apos;s free
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Already have an account
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Koforidua Technical University · IT Services
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login"    className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/register" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
