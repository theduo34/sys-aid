# CLAUDE.md — SysAid
## University IT Help Desk System · AI Agent Specification

> This file is the single source of truth for Claude Code when working in this repository.
> Read every section before writing any code, creating any file, or making any decision.

---

## Commands

```bash
bun dev          # start dev server at localhost:3000
bun build        # production build
bun lint         # run ESLint
bun shadcn:add   # add a shadcn component: bun shadcn:add <component>

bun supabase:start              # start local Supabase instance
bun supabase:generate-types     # regenerate types_db.ts from local schema
bun supabase:generate-migration # diff schema and create a new migration
```

---

## Project Overview

**SysAid** is a university IT help desk ticketing platform. Students, lecturers, and staff submit IT support tickets. IT technicians manage and resolve them. IT managers oversee the whole system via reports and admin controls.

**Inspiration:** osTicket, SysAid — leaner, modern, and university-focused.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 · App Router · React 19 · TypeScript (strict) |
| Styling | Tailwind CSS v4 · shadcn/ui (`radix-lyra` style) |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| File storage | Supabase Storage |
| Realtime | Supabase Realtime (live ticket updates) |
| Email | Supabase Edge Functions + Resend |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Icons | `@phosphor-icons/react` |
| Fonts | Geist Sans · Geist Mono · JetBrains Mono (body defaults to monospace) |
| Toasts | `sonner` |

**Path alias:** `@/` maps to the project root. Always use `@/components/...`, `@/lib/...`, `@/hooks/...`, etc.

---

## Tailwind CSS v4 Rules

- **No `tailwind.config.js`.** Tailwind v4 does not use a config file. All CSS variables and theme tokens live in `app/globals.css` under `@theme inline { ... }`. Never create a separate config file. Edit `globals.css` for theme changes.
- **Semantic color tokens only.** Always use tokens like `bg-primary`, `text-secondary`, `text-muted-foreground`, `bg-destructive`, `border-border`. **Never use raw Tailwind color classes** like `text-red-300`, `bg-blue-500`, or `text-slate-600`. Semantic tokens handle dark mode automatically.
- Use `gap-*` for spacing between flex/grid children. Never use `space-x-*` or `space-y-*`.
- Use `size-*` when width and height are equal (`size-10` not `w-10 h-10`).
- No manual `dark:` color overrides anywhere — semantic tokens handle dark mode automatically.

---

## shadcn/ui Rules

- shadcn components are installed as source into `components/ui/`. Base style is `radix-lyra`, using `radix-ui` primitives (not individual `@radix-ui/*` packages).
- `Slot` import comes from `radix-ui`, not `@radix-ui/react-slot`.
- Use `cn()` from `@/lib/utils` for all conditional class merging.
- `className` is for **layout only** — never use it to override component colors or typography.
- Icons inside `Button` use the `data-icon` attribute: `data-icon="inline-start"` or `data-icon="inline-end"`. Do not add sizing classes to those icons.
- Forms use `FieldGroup` + `Field` wrappers, not raw `div` with `space-y-*`.
- `Dialog`, `Sheet`, and `Drawer` always need a `Title` component (use `className="sr-only"` if visually hidden).
- Never add manual `z-index` to overlay components — they manage their own stacking context.
- Toast notifications use `sonner`: import `toast` from `sonner` and call `toast()`, `toast.error()`, etc. Never build custom toast markup.

```bash
# Adding components — check what's already installed first
ls components/ui/
bun shadcn:add button card dialog
```

---

## Icons

Use **`@phosphor-icons/react`** exclusively. Never use `lucide-react` or any other icon library.

Icon names end in `Icon`: `CheckCircleIcon`, `SpinnerIcon`, `TicketIcon`, `UserIcon`, etc.

```tsx
import { CheckCircleIcon, SpinnerIcon } from '@phosphor-icons/react'
```

---

## Fonts

Three fonts are configured in `layout.tsx`:
- `--font-geist-sans` — Geist Sans
- `--font-geist-mono` — Geist Mono
- `--font-mono` — JetBrains Mono

The `<body>` defaults to monospace. Do not override this globally.

---

## User Roles

Four roles. Stored in `profiles.role`, enforced via Supabase RLS and the RBAC system.

| Role | Key Capabilities |
|---|---|
| `student` | Submit tickets, view own tickets, add comments, close resolved tickets |
| `staff` | Same as student + tickets default to `high` priority |
| `technician` | View assigned queue, update status, add internal notes, resolve tickets |
| `admin` | Full access — all of the above + users, categories, SLA, reports, impersonation |

### Registration & Role Assignment Rules

- **All self-registrations default to `student`.** There is no role selector on the register page.
- **Technician accounts are created by admins only** via `/admin/users` using the service role key (`/api/admin/users`). No technician can self-register.
- **Admin accounts are created by other admins only.** Never via self-registration.
- **Staff promotion flow:** A student submits a request via `RequestStaffButton` on the dashboard. Admin reviews pending requests in `/admin/users` and approves or rejects. On approval, the profile role is updated to `staff` and their tickets automatically get `high` default priority.
- Only one pending role request per user at a time (enforced server-side).

### Why staff vs student matters

Staff tickets default to `high` priority because lecturers and staff have time-sensitive teaching commitments. A broken projector before a lecture is a P2 (high) incident, not P3 (medium). This priority difference is enforced **server-side only** in `ticketActions.ts` — the client never decides priority defaults.

---

## Folder Structure

Follow this structure exactly. Do not deviate or create new top-level directories.

```
uni-desk/
├── app/
│   ├── (auth)/                         # Public routes — no sidebar/nav
│   │   ├── login/
│   │   │   └── page.tsx                # Metadata only — imports from components/pages/
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (protected)/                    # Authenticated routes — shared sidebar layout
│   │   ├── layout.tsx                  # Auth guard + sidebar + topbar
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Metadata only
│   │   ├── tickets/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── knowledge-base/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── agent/                      # Technician-only routes
│   │   │   ├── queue/
│   │   │   │   └── page.tsx
│   │   │   └── tickets/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   └── admin/                      # Admin-only routes
│   │       ├── page.tsx
│   │       ├── users/
│   │       │   └── page.tsx
│   │       ├── categories/
│   │       │   └── page.tsx
│   │       ├── departments/
│   │       │   └── page.tsx
│   │       └── reports/
│   │           └── page.tsx
│   │
│   ├── api/                            # Next.js API routes
│   │   ├── tickets/
│   │   │   ├── route.ts                # GET list, POST create
│   │   │   └── [id]/
│   │   │       └── route.ts            # GET one, PATCH, DELETE
│   │   ├── comments/
│   │   │   └── route.ts
│   │   ├── users/
│   │   │   └── route.ts
│   │   ├── notifications/
│   │   │   └── route.ts
│   │   ├── role-requests/
│   │   │   ├── route.ts                # GET pending (admin), POST create (student)
│   │   │   └── [id]/
│   │   │       └── route.ts            # PATCH approve/reject (admin)
│   │   └── admin/
│   │       ├── impersonate/
│   │       │   └── route.ts            # POST start, DELETE stop impersonation
│   │       └── users/
│   │           └── route.ts            # POST create technician (service role key)
│   │
│   └── globals.css                     # Tailwind v4 theme tokens — edit here, not a config file
│
├── components/
│   ├── layout/                         # App shell components
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx                  # Shows impersonation banner when active
│   │   ├── AuthLayout.tsx
│   │   └── ProtectedLayout.tsx
│   │
│   ├── shared/                         # Reusable across any feature
│   │   ├── StatusBadge.tsx             # Ticket status pill
│   │   ├── PriorityBadge.tsx           # P1–P4 indicator
│   │   ├── Avatar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── DataTable.tsx               # Generic sortable/filterable table
│   │
│   ├── builders/                       # Generic form/input builder wrappers
│   │   ├── FormField.tsx               # Label + input + error message
│   │   ├── SelectField.tsx
│   │   ├── TextareaField.tsx
│   │   └── FileUpload.tsx
│   │
│   ├── pages/                          # Page-level assembled views
│   │   │                               # Group by domain — one folder per feature area
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── ticket/                     # ALL ticket views live here (list, detail, new)
│   │   │   ├── TicketsPage.tsx
│   │   │   ├── TicketDetailPage.tsx
│   │   │   └── TicketNewPage.tsx
│   │   ├── agent/                      # ALL agent views live here
│   │   │   └── AgentQueuePage.tsx
│   │   ├── admin/                      # ALL admin views live here
│   │   │   ├── AdminPage.tsx
│   │   │   ├── AdminUsersPage.tsx
│   │   │   ├── AdminCategoriesPage.tsx
│   │   │   └── AdminDepartmentsPage.tsx
│   │   ├── knowledge-base/
│   │   │   └── KnowledgeBasePage.tsx
│   │   └── reports/
│   │       └── ReportsPage.tsx
│   │
│   └── ui/                             # shadcn/ui components — never edit manually
│
├── features/                           # Feature-scoped components, hooks, types, actions
│   ├── tickets/
│   │   ├── components/
│   │   │   ├── TicketCard.tsx
│   │   │   ├── TicketList.tsx
│   │   │   ├── TicketFilters.tsx
│   │   │   ├── TicketForm.tsx
│   │   │   ├── TicketDetail.tsx
│   │   │   ├── TicketTimeline.tsx
│   │   │   ├── TicketStatusSelect.tsx
│   │   │   └── SLACountdown.tsx
│   │   ├── hooks/
│   │   │   ├── useTickets.ts
│   │   │   ├── useTicket.ts
│   │   │   └── useCreateTicket.ts
│   │   ├── actions/
│   │   │   └── ticketActions.ts        # Server actions: create, update, assign, close
│   │   └── types/
│   │       └── ticket.types.ts
│   │
│   ├── comments/
│   │   ├── components/
│   │   │   ├── CommentThread.tsx
│   │   │   ├── CommentItem.tsx
│   │   │   └── CommentForm.tsx
│   │   ├── hooks/
│   │   │   └── useComments.ts
│   │   └── types/
│   │       └── comment.types.ts
│   │
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts              # Returns real user + effective role (impersonation-aware)
│   │   │   └── usePermission.ts        # Permission check hook for client components
│   │   └── guards/
│   │       ├── AuthGuard.tsx
│   │       └── RoleGuard.tsx
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── StatsCards.tsx
│   │   │   ├── RecentTickets.tsx
│   │   │   └── QuickActions.tsx
│   │   └── hooks/
│   │       └── useDashboardStats.ts
│   │
│   ├── agent/
│   │   ├── components/
│   │   │   ├── AgentQueue.tsx
│   │   │   ├── AgentTicketDetail.tsx
│   │   │   └── AssignTicketSelect.tsx
│   │   └── hooks/
│   │       └── useAgentQueue.ts
│   │
│   ├── admin/
│   │   ├── components/
│   │   │   ├── UserTable.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   ├── DepartmentForm.tsx
│   │   │   ├── SLASettings.tsx
│   │   │   ├── CreateTechnicianForm.tsx  # Admin creates technician accounts
│   │   │   └── ImpersonatePicker.tsx
│   │   └── hooks/
│   │       ├── useAdminData.ts
│   │       └── useImpersonation.ts
│   │
│   ├── role-requests/
│   │   ├── components/
│   │   │   ├── RequestStaffButton.tsx    # Student requests staff promotion
│   │   │   └── RoleRequestsList.tsx      # Admin reviews and approves/rejects
│   │   ├── hooks/
│   │   │   └── useRoleRequests.ts
│   │   └── types/
│   │       └── role-request.types.ts
│   │
│   ├── knowledge-base/
│   │   ├── components/
│   │   │   ├── ArticleList.tsx
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleDetail.tsx
│   │   │   └── ArticleForm.tsx         # Admin only
│   │   └── hooks/
│   │       └── useArticles.ts
│   │
│   └── reports/
│       ├── components/
│       │   ├── VolumeChart.tsx
│       │   ├── ResolutionTimeChart.tsx
│       │   ├── CategoryBreakdown.tsx
│       │   └── SLAComplianceCard.tsx
│       └── hooks/
│           └── useReportData.ts
│
├── hooks/                              # Global/shared hooks (not feature-specific)
├── providers/                          # React context providers
├── lib/
│   ├── utils.ts                        # cn() and shared utilities
│   ├── permissions.ts                  # RBAC — roles, permissions, can() function
│   └── supabase/
│       ├── client.ts                   # Browser Supabase client
│       ├── server.ts                   # Server Supabase client
│       └── requireRole.ts             # API route role guard middleware
└── types/
    └── types_db.ts                     # Auto-generated from schema — never edit manually
```

---

## Import Convention & Data Flow

```
features/[feature]/components/
        ↓
components/pages/[page]/PageName.tsx      ← assembles features into a full view
        ↓
app/(auth|protected)/[route]/page.tsx     ← metadata only, imports the page component
```

### The three rules

1. **`app/**/page.tsx` is metadata only.** Export `metadata` and a default function that returns the page component. Zero logic, zero JSX beyond the import.
2. **`components/pages/` assembles features.** These can import from multiple features and from `components/shared/` or `components/builders/`.
3. **`features/` are self-contained.** A feature must not import from another feature's components. Only from `components/shared/`, `components/builders/`, and `components/ui/`.

### Example

```tsx
// ✅ app/(protected)/tickets/page.tsx — metadata only
import { TicketsPage } from '@/components/pages/ticket/TicketsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Tickets | SysAid',
  description: 'View and manage your IT support tickets',
}

export default function TicketsRoute() {
  return <TicketsPage />
}
```

```tsx
// ✅ components/pages/ticket/TicketsPage.tsx — assembles features
import { TicketList } from '@/features/tickets/components/TicketList'
import { TicketFilters } from '@/features/tickets/components/TicketFilters'
import { PageHeader } from '@/components/shared/PageHeader'

export function TicketsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Tickets" action={{ label: 'New Ticket', href: '/tickets/new' }} />
      <TicketFilters />
      <TicketList />
    </div>
  )
}
```

```tsx
// ✅ features/tickets/components/TicketList.tsx — feature logic lives here
'use client'
import { useTickets } from '../hooks/useTickets'
import { TicketCard } from './TicketCard'
import { EmptyState } from '@/components/shared/EmptyState'

export function TicketList() {
  const { tickets, isLoading } = useTickets()
  if (isLoading) return <LoadingSpinner />
  if (!tickets.length) return <EmptyState message="No tickets yet." />
  return tickets.map(t => <TicketCard key={t.id} ticket={t} />)
}
```

---

## Supabase Database Schema

### `profiles`
Extends `auth.users`. Auto-created via trigger on signup.
```sql
id                  uuid PRIMARY KEY REFERENCES auth.users(id)
full_name           text NOT NULL
role                text NOT NULL DEFAULT 'student'   -- student | staff | technician | admin
department          text
student_id          text
impersonated_by     uuid REFERENCES profiles(id)      -- set while impersonation is active
created_at          timestamptz DEFAULT now()
```

### `categories`
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
name              text NOT NULL
department        text
default_priority  text DEFAULT 'medium'
created_at        timestamptz DEFAULT now()
```

### `tickets`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
title           text NOT NULL
description     text NOT NULL
status          text NOT NULL DEFAULT 'open'
                -- open | assigned | in_progress | pending | resolved | closed
priority        text NOT NULL DEFAULT 'medium'  -- low | medium | high | critical
category_id     uuid REFERENCES categories(id)
created_by      uuid REFERENCES profiles(id) NOT NULL
assigned_to     uuid REFERENCES profiles(id)
attachment_url  text
sla_deadline    timestamptz
resolved_at     timestamptz
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `comments`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
ticket_id    uuid REFERENCES tickets(id) ON DELETE CASCADE NOT NULL
author_id    uuid REFERENCES profiles(id) NOT NULL
body         text NOT NULL
is_internal  boolean DEFAULT false    -- only visible to technician/admin
created_at   timestamptz DEFAULT now()
```

### `knowledge_articles`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
title        text NOT NULL
slug         text UNIQUE NOT NULL
body         text NOT NULL            -- markdown
category_id  uuid REFERENCES categories(id)
created_by   uuid REFERENCES profiles(id)
published    boolean DEFAULT false
created_at   timestamptz DEFAULT now()
updated_at   timestamptz DEFAULT now()
```

### `role_requests`
Students request promotion to `staff`. Admins approve or reject. One pending request per user.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) NOT NULL
requested_role  text NOT NULL DEFAULT 'staff'
reason          text
status          text NOT NULL DEFAULT 'pending'  -- pending | approved | rejected
reviewed_by     uuid REFERENCES profiles(id)
created_at      timestamptz DEFAULT now()
reviewed_at     timestamptz
```

### `impersonation_log`
Audit trail — every impersonation session is recorded and never deleted.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
admin_id        uuid REFERENCES profiles(id) NOT NULL
target_user_id  uuid REFERENCES profiles(id) NOT NULL
started_at      timestamptz DEFAULT now()
ended_at        timestamptz
reason          text
```

> `types_db.ts` is auto-generated via `bun supabase:generate-types`. Never edit it manually. Always regenerate after schema changes.

---

## Supabase Auth & RLS

- Email/password auth via Supabase Auth.
- A DB trigger auto-creates a `profiles` row on `auth.users` insert.
- Role lives in `profiles.role`. Never trust client-side role filtering — always enforce via RLS.

### RLS policy summary

| Table | Policy |
|---|---|
| `tickets` | `student`/`staff` see only `created_by = auth.uid()`. `technician` sees assigned + open. `admin` sees all. |
| `comments` | Users see non-internal on own tickets. `technician`/`admin` see all including internal. |
| `profiles` | Users see own. `admin` sees all. |
| `categories` | All roles read. `admin` only for write. |
| `knowledge_articles` | All roles read published. `admin` only for write. |
| `impersonation_log` | `admin` insert only. `admin` read own entries. No updates or deletes by anyone. |

### Supabase client setup

```ts
// lib/supabase/client.ts — use in 'use client' components and hooks
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// lib/supabase/server.ts — use in Server Components, API routes, Server Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
}
```

---

## RBAC — Role-Based Access Control

### Design philosophy

Roles group permissions. Permissions control individual actions. A single `can()` function is the source of truth for all permission checks across the entire codebase. Enforcement happens on both layers — frontend hides UI, backend blocks data. **Never rely on frontend alone.**

```
Role  →  Permission set  →  can(role, action, context?)  →  UI guard / API guard / RLS
```

### Permission definitions (`lib/permissions.ts`)

```ts
export type Role = 'student' | 'staff' | 'technician' | 'admin'

export type Permission =
  // Tickets
  | 'tickets:create'
  | 'tickets:read:own'
  | 'tickets:read:assigned'
  | 'tickets:read:all'
  | 'tickets:update:assigned'
  | 'tickets:update:all'
  | 'tickets:assign:self'
  | 'tickets:assign:any'
  | 'tickets:resolve:assigned'
  | 'tickets:close:own'
  | 'tickets:delete:any'
  // Comments
  | 'comments:create:public'
  | 'comments:create:internal'
  | 'comments:read:internal'
  // Knowledge base
  | 'kb:read'
  | 'kb:write'
  // Admin
  | 'users:manage'
  | 'categories:manage'
  | 'reports:view'
  | 'sla:configure'
  | 'roles:assign'
  | 'users:impersonate'

const rolePermissions: Record<Role, Permission[]> = {
  student: [
    'tickets:create',
    'tickets:read:own',
    'tickets:close:own',
    'comments:create:public',
    'kb:read',
  ],
  staff: [
    // Same as student — higher default priority is applied in ticketActions.ts, not here
    'tickets:create',
    'tickets:read:own',
    'tickets:close:own',
    'comments:create:public',
    'kb:read',
  ],
  technician: [
    'tickets:read:assigned',
    'tickets:update:assigned',
    'tickets:assign:self',
    'tickets:resolve:assigned',
    'comments:create:public',
    'comments:create:internal',
    'comments:read:internal',
    'kb:read',
  ],
  admin: [
    'tickets:create',
    'tickets:read:own',
    'tickets:read:assigned',
    'tickets:read:all',
    'tickets:update:assigned',
    'tickets:update:all',
    'tickets:assign:self',
    'tickets:assign:any',
    'tickets:resolve:assigned',
    'tickets:close:own',
    'tickets:delete:any',
    'comments:create:public',
    'comments:create:internal',
    'comments:read:internal',
    'kb:read',
    'kb:write',
    'users:manage',
    'categories:manage',
    'reports:view',
    'sla:configure',
    'roles:assign',
    'users:impersonate',
  ],
}

export interface PermissionContext {
  userId?: string           // ID of the user performing the action
  resourceOwnerId?: string  // ID of who created the resource
  assignedToId?: string     // ID of who the ticket is assigned to
}

/**
 * Core permission check — use this everywhere, on client and server.
 */
export function can(
  role: Role,
  permission: Permission,
  context?: PermissionContext
): boolean {
  const allowed = rolePermissions[role]?.includes(permission) ?? false
  if (!allowed) return false

  // Scoped ownership checks
  if (permission === 'tickets:read:own' || permission === 'tickets:close:own') {
    return context?.userId === context?.resourceOwnerId
  }
  if (
    permission === 'tickets:update:assigned' ||
    permission === 'tickets:resolve:assigned'
  ) {
    return context?.userId === context?.assignedToId
  }

  return true
}
```

---

### Special rules

#### Staff default priority
When a `staff` user creates a ticket, `ticketActions.ts` sets `priority = 'high'` automatically. Students get `priority = 'medium'`. This is enforced **server-side only** — the client never decides default priority.

```ts
// features/tickets/actions/ticketActions.ts (excerpt)
const defaultPriority: Record<Role, 'low' | 'medium' | 'high' | 'critical'> = {
  student:    'medium',
  staff:      'high',
  technician: 'medium',
  admin:      'medium',
}

export async function createTicket(data: CreateTicketInput, userRole: Role) {
  const priority = data.priority ?? defaultPriority[userRole]
  // ... insert to Supabase with resolved priority
}
```

#### Admin impersonation
Admins can temporarily act as any other user to debug issues or assist with support. The system uses a **session-based approach**: impersonation state lives in the user's session cookie and the `impersonation_log` table.

**Rules:**
- Only `admin` role can start impersonation (`users:impersonate` permission).
- Admins cannot impersonate another admin — only `student`, `staff`, and `technician` accounts.
- All actions taken while impersonating are logged against the real admin's ID in `impersonation_log`.
- `useAuth()` returns `{ realUser, effectiveUser, isImpersonating }` so components always know which identity is active.
- `Topbar.tsx` renders a persistent warning banner while impersonation is active — it cannot be hidden.
- Impersonation ends when the admin clicks "Exit impersonation" or their session expires.
- The `impersonation_log` table is **append-only** — no one can update or delete rows, not even admins.

```ts
// lib/impersonation.ts

export interface ImpersonationSession {
  realAdminId: string
  targetUserId: string
  targetRole: Role
  startedAt: string
}

// Store in session cookie (server-side, httpOnly)
const IMPERSONATION_COOKIE = 'SysAid_impersonation'

export function getImpersonationSession(
  cookieStore: ReturnType<typeof cookies>
): ImpersonationSession | null {
  const raw = cookieStore.get(IMPERSONATION_COOKIE)?.value
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}
```

```ts
// app/api/admin/impersonate/route.ts

// POST — start impersonation
export async function POST(req: Request) {
  const { error, user, role } = await requireRole(['admin'])
  if (error) return error

  const { targetUserId, reason } = await req.json()

  // Verify target is not an admin
  const { data: target } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', targetUserId)
    .single()

  if (!target || target.role === 'admin') {
    return NextResponse.json({ error: 'Cannot impersonate admin accounts' }, { status: 403 })
  }

  // Log the session
  await supabase.from('impersonation_log').insert({
    admin_id: user.id,
    target_user_id: targetUserId,
    reason,
  })

  // Set impersonation cookie (server-side, short-lived)
  const session: ImpersonationSession = {
    realAdminId: user.id,
    targetUserId,
    targetRole: target.role as Role,
    startedAt: new Date().toISOString(),
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(IMPERSONATION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour max
  })
  return res
}

// DELETE — end impersonation
export async function DELETE() {
  // Update ended_at in log
  const cookieStore = cookies()
  const session = getImpersonationSession(cookieStore)
  if (session) {
    await supabase
      .from('impersonation_log')
      .update({ ended_at: new Date().toISOString() })
      .eq('admin_id', session.realAdminId)
      .is('ended_at', null)
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.delete(IMPERSONATION_COOKIE)
  return res
}
```

```tsx
// features/auth/hooks/useAuth.ts — impersonation-aware auth hook
'use client'

export function useAuth() {
  // Returns both identities when impersonating
  return {
    realUser,           // always the actual logged-in admin
    effectiveUser,      // the impersonated user (or same as realUser if not impersonating)
    effectiveRole,      // role used for all permission checks
    isImpersonating,    // boolean — true when acting as another user
  }
}
```

```tsx
// components/layout/Topbar.tsx — impersonation banner (always visible when active)
{isImpersonating && (
  <div className="bg-warning text-warning-foreground flex items-center justify-between px-4 py-2 text-sm">
    <span>
      Viewing as <strong>{effectiveUser.full_name}</strong> ({effectiveRole})
    </span>
    <button onClick={exitImpersonation}>Exit impersonation</button>
  </div>
)}
```

---

### Frontend enforcement

#### `usePermission` hook

```ts
// features/auth/hooks/usePermission.ts
'use client'
import { useAuth } from './useAuth'
import { can, Permission, PermissionContext } from '@/lib/permissions'

export function usePermission(
  permission: Permission,
  context?: Omit<PermissionContext, 'userId'>
) {
  const { effectiveUser, effectiveRole } = useAuth()
  if (!effectiveRole) return false
  return can(effectiveRole, permission, {
    userId: effectiveUser?.id,
    ...context,
  })
}
```

Usage in components:

```tsx
const canCreateInternal = usePermission('comments:create:internal')
const canAssignAny      = usePermission('tickets:assign:any')
const canImpersonate    = usePermission('users:impersonate')

{canCreateInternal && (
  <label className="flex items-center gap-2 text-sm text-muted-foreground">
    <input type="checkbox" name="is_internal" />
    Mark as internal note
  </label>
)}
```

#### `RoleGuard` component

```tsx
// features/auth/guards/RoleGuard.tsx
'use client'
import { useAuth } from '../hooks/useAuth'
import { Role } from '@/lib/permissions'
import { redirect } from 'next/navigation'

interface RoleGuardProps {
  allowedRoles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { effectiveRole } = useAuth()
  if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
    return fallback ?? redirect('/dashboard')
  }
  return <>{children}</>
}
```

#### Server-side route guard

For role-specific pages (e.g. `/admin`, `/agent/queue`), add a server-side role check at the top of the Server Component before rendering anything:

```tsx
// app/(protected)/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminPage } from '@/components/pages/admin/AdminPage'

export default async function AdminRoute() {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  return <AdminPage />
}
```

---

### Backend enforcement

#### API route middleware (`lib/supabase/requireRole.ts`)

```ts
import { createClient } from './server'
import { Role } from '@/lib/permissions'
import { NextResponse } from 'next/server'
import { getImpersonationSession } from '@/lib/impersonation'
import { cookies } from 'next/headers'

export async function requireRole(allowedRoles: Role[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !allowedRoles.includes(profile.role as Role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  // Resolve effective identity (impersonation-aware)
  const impSession = getImpersonationSession(cookies())
  const effectiveUserId  = impSession?.targetUserId  ?? user.id
  const effectiveRole    = impSession?.targetRole    ?? (profile.role as Role)

  return {
    user,                          // real authenticated admin
    role: profile.role as Role,    // real role
    effectiveUserId,               // who we're acting as
    effectiveRole,                 // role we're acting with
    isImpersonating: !!impSession,
  }
}
```

Usage in API routes:

```ts
// app/api/tickets/[id]/route.ts
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireRole(['technician', 'admin'])
  if ('error' in auth) return auth.error

  const { effectiveUserId, effectiveRole } = auth

  // Technicians can only update their assigned tickets
  if (effectiveRole === 'technician') {
    const { data: ticket } = await supabase
      .from('tickets')
      .select('assigned_to')
      .eq('id', params.id)
      .single()

    if (ticket?.assigned_to !== effectiveUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  // ... proceed with update
}
```

#### Supabase RLS policies

RLS is the hard enforcement layer. Even if API code has a bug, the database rejects unauthorized reads/writes.

```sql
-- Tickets: submitters see only their own tickets
CREATE POLICY "submitters_own_tickets" ON tickets
  FOR SELECT USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('technician', 'admin')
    )
  );

-- Tickets: technicians update only their assigned tickets
CREATE POLICY "technician_update_assigned" ON tickets
  FOR UPDATE USING (
    auth.uid() = assigned_to
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Comments: hide internal notes from non-agents
CREATE POLICY "internal_notes_visibility" ON comments
  FOR SELECT USING (
    is_internal = false
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('technician', 'admin')
    )
  );

-- Impersonation log: append-only, admin read
CREATE POLICY "impersonation_log_insert" ON impersonation_log
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "impersonation_log_read" ON impersonation_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
-- No UPDATE or DELETE policies — the log is immutable
```

---

### RBAC enforcement map

| Layer | Mechanism | What it protects |
|---|---|---|
| Permission definitions | `lib/permissions.ts` — `rolePermissions` map | Single source of truth |
| UI visibility | `usePermission()` hook | Hide/show buttons, tabs, fields |
| Page access | `RoleGuard` + server role check | Prevent wrong role loading a route |
| API authorization | `requireRole()` middleware | Reject unauthorized API calls |
| Data security | Supabase RLS policies | Hard block at the database |
| Ownership (code) | `can()` with context | Technician assigned-only rule |
| Ownership (data) | RLS `assigned_to = auth.uid()` | Same rule, database-enforced |
| Impersonation audit | `impersonation_log` (append-only) | Permanent record of all sessions |

### RBAC rules for the agent

- `lib/permissions.ts` is the **only** place permissions are defined. Never hardcode role strings like `role === 'admin'` outside this file.
- Always use `can()` for permission checks, never manual role comparisons in components.
- `usePermission()` is for client components. In Server Components, call `can()` directly after fetching the role from Supabase.
- `requireRole()` must be the **first call** in every protected API route.
- RLS must cover every permission that touches data — frontend guards are UX, RLS is security.
- All impersonation actions use the **real admin's ID** for audit logging, never the impersonated user's ID.
- Admins **cannot** impersonate other admins — enforce this check before setting the impersonation cookie.
- The impersonation banner in `Topbar.tsx` must always be visible when `isImpersonating === true`. It cannot be conditionally hidden.

---

## Ticket Lifecycle

```
open → assigned → in_progress → pending → resolved → closed
                                    ↑           |
                                    └───────────┘  (user re-opens)
```

| Status | Meaning |
|---|---|
| `open` | Submitted, not yet assigned |
| `assigned` | Assigned to a technician |
| `in_progress` | Technician actively working |
| `pending` | Waiting on user response |
| `resolved` | Technician marked done — user can confirm or re-open |
| `closed` | Confirmed resolved, or auto-closed 48h after resolved |

---

## SLA Priority Levels

| Priority | Label | Default for | Response | Resolution | Semantic token |
|---|---|---|---|---|---|
| `critical` | P1 | — | 1 hour | 4 hours | `text-destructive` / `bg-destructive/10` |
| `high` | P2 | staff | 4 hours | 24 hours | `text-warning` / `bg-warning/10` |
| `medium` | P3 | student | 24 hours | 72 hours | `text-secondary` / `bg-secondary/10` |
| `low` | P4 | — | 72 hours | 1 week | `text-muted-foreground` / `bg-muted` |

`sla_deadline` is computed on ticket creation using `defaultPriority` in `ticketActions.ts`. `SLACountdown.tsx` shows a live countdown. Overdue rows use `bg-destructive/5` in the agent queue.

**All badge and status colors must use semantic tokens. Never hardcode color values.**

---

## Key Feature Specs

### Ticket form (`TicketForm.tsx`)
Fields: title, category (from DB), priority (pre-filled by role default, user can override), description, attachment (optional, Supabase Storage).
On submit: insert to `tickets` via `ticketActions.ts` → upload file if present → call `/api/notifications`.

### Agent queue (`AgentQueue.tsx`)
- Shows `assigned_to = auth.uid()` OR `status = 'open'` (unassigned pool).
- Filterable by status, priority, category, date range.
- SLA countdown per row. Overdue rows styled with `bg-destructive/5`.
- Click → `AgentTicketDetail` with internal notes tab.

### Internal notes
`is_internal = true` comments. Only `technician` and `admin` can see them. Rendered with `bg-muted border-l-2 border-warning` styling and a `text-warning` "Internal" badge.

### Notifications
| Trigger | Recipient |
|---|---|
| Ticket created | Submitter (confirmation) |
| Ticket assigned | Assigned technician |
| Status changed | Submitter |
| Public comment added | Submitter |

### Realtime
Subscribe to `tickets` table changes on the agent queue and ticket detail pages. Update state without refresh.

---

## Coding Conventions

- **TypeScript strict.** No `any`. All types in `features/[feature]/types/`.
- **Server Components by default.** Add `'use client'` only for browser APIs, event handlers, or hooks.
- **Server Components fetch directly** using the server Supabase client. Never `useEffect` for initial data in Server Components.
- **Hooks are client-side only.** Wrap Supabase queries with `useState`/`useEffect`.
- **Comments: `//` in `.ts`/`.tsx` files, `{/* */}` in JSX only.** No `/* */` block comments. No multi-line comment blocks. Avoid unnecessary comments — only write one when the WHY is non-obvious.
- **Middleware lives in `middleware.ts`** at the project root. Next.js App Router uses this file for auth redirects and cookie handling. Never rename it.
- **Zod for all form validation.** Co-locate schemas with their form components.
- **API routes return `{ data, error }`.** Always. Surface errors with `toast.error()` from `sonner`.
- **Loading states always.** Use `loading.tsx` in app routes. Use skeleton components in content areas.
- **Semantic colors only.** Use `text-primary`, `text-secondary`, `text-muted-foreground`, `bg-muted`, `text-destructive`, `border-border`, etc. Never raw values like `text-red-300` or `bg-gray-100`.

### Naming

| Thing | Convention |
|---|---|
| Components | PascalCase |
| Hooks | camelCase prefixed `use` |
| Types / Interfaces | PascalCase (e.g. `Ticket`, `Comment`, `Profile`) |
| Server actions | camelCase in `actions/` (e.g. `createTicket`) |
| API routes | kebab-case route segments |

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only — never import in client code
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=              # e.g. http://localhost:3000
IMPERSONATION_SECRET=             # used to sign impersonation session cookie
```

---

## Pages & Access Control

| Route | Roles | Purpose |
|---|---|---|
| `/login` | Public | Email/password login |
| `/register` | Public | Sign up |
| `/dashboard` | All | Stats + recent tickets |
| `/tickets` | student, staff, admin | Own ticket list |
| `/tickets/new` | student, staff | Submit a ticket |
| `/tickets/[id]` | Submitter, admin | Ticket detail + comments |
| `/agent/queue` | technician, admin | Full queue with SLA timers |
| `/agent/tickets/[id]` | technician, admin | Detail + internal notes + controls |
| `/knowledge-base` | All | Browse FAQ articles |
| `/admin` | admin | Overview |
| `/admin/users` | admin | Manage users, roles, impersonation |
| `/admin/categories` | admin | Categories and SLA config |
| `/admin/reports` | admin | Charts and analytics |

---

## Out of Scope (MVP)

Do not build. List as future enhancements in docs.

- LDAP / SSO
- Live chat
- Mobile app
- Asset / inventory management
- Change management workflows
- Multi-language support

---

## Agent Decision Rules

When in doubt, apply these in order:

1. Read this file before creating any file or route.
2. `app/**/page.tsx` → metadata only. No logic. No JSX beyond the page import.
3. `components/pages/` → group by domain (`ticket/`, `agent/`, `admin/`), not one folder per page.
4. `features/[feature]/components/` → all feature-specific UI and logic.
5. `components/shared/` → truly reusable, zero feature knowledge.
6. `components/builders/` → generic form/input wrappers only.
7. `components/ui/` → shadcn only, never edit manually. Use `bun shadcn:add`.
8. `types_db.ts` → auto-generated. Never edit manually. Run `bun supabase:generate-types` after schema changes.
9. `lib/permissions.ts` → only place permissions are defined. Never hardcode role strings elsewhere.
10. **No raw color classes.** Only semantic tokens (`text-primary`, `text-destructive`, etc.).
11. **No `lucide-react`.** Only `@phosphor-icons/react`.
12. **RLS is the security layer.** Never rely on client-side role filtering alone.
13. **`requireRole()` first** in every protected API route, before any logic.
14. **Impersonation banner always visible** when `isImpersonating === true` — never conditionally hide it.
15. Keep components under ~150 lines. Split if larger.
16. **All signups default to `student`.** Technicians/admins are never self-registered — admins create them server-side via `/api/admin/users`.
17. **Comments: `//` in TS/TSX, `{/* */}` in JSX only.** No block comments. No unnecessary comments.
18. **`middleware.ts` at project root** — do not rename or move.