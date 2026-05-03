import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

// Service role client — bypasses RLS so we can seed freely
const db = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const hoursFromNow = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString()
const hoursAgo     = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()

const TEST_USERS = [
  { email: 'kwame.mensah@ktu.edu.gh',  password: 'Test1234!', full_name: 'Kwame Mensah',     role: 'student'    as const },
  { email: 'abena.osei@ktu.edu.gh',    password: 'Test1234!', full_name: 'Dr. Abena Osei',   role: 'staff'      as const },
  { email: 'kofi.asante@ktu.edu.gh',   password: 'Test1234!', full_name: 'Kofi Asante',      role: 'technician' as const },
  { email: 'it.admin@ktu.edu.gh',      password: 'Test1234!', full_name: 'IT Administrator', role: 'admin'      as const },
]

const CATEGORIES = [
  { name: 'Network & Connectivity',   department: 'IT', default_priority: 'high'   as const },
  { name: 'Hardware & Equipment',     department: 'IT', default_priority: 'medium' as const },
  { name: 'Software & Applications',  department: 'IT', default_priority: 'medium' as const },
  { name: 'Email & Communication',    department: 'IT', default_priority: 'medium' as const },
  { name: 'Access & Accounts',        department: 'IT', default_priority: 'high'   as const },
  { name: 'Printing & Scanning',      department: 'IT', default_priority: 'low'    as const },
]

async function seed() {
  console.log('Seeding SysAid...\n')

  // --- Users ---
  const ids: Record<string, string> = {}

  for (const u of TEST_USERS) {
    const { data: list } = await db.auth.admin.listUsers()
    const existing = list?.users.find(x => x.email === u.email)

    if (existing) {
      ids[u.role] = existing.id
      console.log(`  skip    ${u.email} (already exists)`)
    } else {
      const { data, error } = await db.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name },
      })
      if (error) { console.error(`  error   ${u.email}: ${error.message}`); continue }
      ids[u.role] = data.user.id
      console.log(`  created ${u.email}`)
    }

    // The DB trigger creates a profile with role='student' — override it here
    const { error: pe } = await db
      .from('profiles')
      .upsert({ id: ids[u.role], full_name: u.full_name, role: u.role })
    if (pe) console.error(`  profile upsert failed for ${u.email}: ${pe.message}`)
  }

  // --- Categories ---
  const { data: existing } = await db.from('categories').select('id, name')
  const existingNames = new Set(existing?.map(c => c.name) ?? [])
  const toInsert = CATEGORIES.filter(c => !existingNames.has(c.name))

  if (toInsert.length > 0) {
    const { error: catErr } = await db.from('categories').insert(toInsert)
    if (catErr) { console.error('\nCategories failed:', catErr.message); return }
  }

  const { data: cats } = await db.from('categories').select('id, name')
  console.log(`\n  ${cats?.length ?? 0} categories ready`)

  const cat = (name: string) => cats?.find(c => c.name === name)?.id ?? null

  // --- Tickets ---
  // Mix of statuses, priorities, and SLA states so every dashboard stat is populated
  const tickets = [
    // in_progress + overdue (critical)
    {
      title:       'Campus WiFi down in Library Block',
      description: 'The entire library block lost WiFi this morning. Around 200 students are affected and cannot access online resources or submit assignments.',
      status:      'in_progress' as const,
      priority:    'critical'    as const,
      category_id: cat('Network & Connectivity'),
      created_by:  ids.student,
      assigned_to: ids.technician,
      sla_deadline: hoursAgo(2),       // SLA expired — counts as overdue
    },
    // open + overdue (high)
    {
      title:       'VPN authentication failure from off-campus',
      description: 'Cannot connect to the university VPN from home. Getting "authentication failed" every attempt. Need access to the internal server to submit my final year project.',
      status:      'open'  as const,
      priority:    'high'  as const,
      category_id: cat('Network & Connectivity'),
      created_by:  ids.student,
      assigned_to: null,
      sla_deadline: hoursAgo(6),       // SLA expired — counts as overdue
    },
    // open + overdue (critical, admin-created)
    {
      title:       'Zoom blocked by antivirus on exam laptops',
      description: 'The university antivirus is blocking Zoom installation on the 15 laptops reserved for online exams scheduled next week. Needs a whitelist exception urgently.',
      status:      'open'    as const,
      priority:    'critical' as const,
      category_id: cat('Software & Applications'),
      created_by:  ids.admin,
      assigned_to: null,
      sla_deadline: hoursAgo(1),       // SLA expired — counts as overdue
    },
    // open + SLA safe
    {
      title:       'Unable to log into student portal after password reset',
      description: 'After resetting my password via the forgot-password link I keep getting "invalid credentials" even with the new password. Cannot access any university system.',
      status:      'open' as const,
      priority:    'high' as const,
      category_id: cat('Access & Accounts'),
      created_by:  ids.student,
      assigned_to: null,
      sla_deadline: hoursFromNow(18),
    },
    // open + SLA safe (staff)
    {
      title:       'Staff room printer showing offline on all workstations',
      description: 'The HP LaserJet in the main staff room shows as offline on every computer. Last printed successfully two days ago.',
      status:      'open'   as const,
      priority:    'medium' as const,
      category_id: cat('Printing & Scanning'),
      created_by:  ids.staff,
      assigned_to: null,
      sla_deadline: hoursFromNow(68),
    },
    // open + low priority
    {
      title:       'Keyboard replacement needed — workstation B12',
      description: 'Keyboard at workstation B12 in the admin block has keys A, S, and D that no longer register. Requesting a replacement unit.',
      status:      'open' as const,
      priority:    'low'  as const,
      category_id: cat('Hardware & Equipment'),
      created_by:  ids.staff,
      assigned_to: null,
      sla_deadline: hoursFromNow(160),
    },
    // in_progress + SLA safe
    {
      title:       'Microsoft Office not activating on new laptop',
      description: 'New department laptop shows Office 365 as unlicensed. Cannot create or edit documents. The licence was supposedly included with the device.',
      status:      'in_progress' as const,
      priority:    'medium'      as const,
      category_id: cat('Software & Applications'),
      created_by:  ids.staff,
      assigned_to: ids.technician,
      sla_deadline: hoursFromNow(48),
    },
    // assigned + SLA safe
    {
      title:       'Computer Lab A — 8–10 minute boot delay on all machines',
      description: 'All 30 computers in Computer Lab A take 8–10 minutes to reach the desktop. This wastes significant time at the start of every practical session.',
      status:      'assigned' as const,
      priority:    'medium'   as const,
      category_id: cat('Hardware & Equipment'),
      created_by:  ids.admin,
      assigned_to: ids.technician,
      sla_deadline: hoursFromNow(60),
    },
    // pending
    {
      title:       'Projector in LT3 not detecting HDMI input',
      description: 'Projector in Lecture Theatre 3 ignores any HDMI source. VGA still works but most modern laptops lack VGA — blocking whole-class presentations.',
      status:      'pending' as const,
      priority:    'high'    as const,
      category_id: cat('Hardware & Equipment'),
      created_by:  ids.staff,
      assigned_to: ids.technician,
      sla_deadline: hoursFromNow(4),
    },
    // resolved — appears in "resolved this week" stat
    {
      title:       'University email not syncing on mobile device',
      description: 'University email stopped syncing on my iPhone. Removing and re-adding the account still fails to connect to the mail server.',
      status:      'resolved' as const,
      priority:    'medium'   as const,
      category_id: cat('Email & Communication'),
      created_by:  ids.student,
      assigned_to: ids.technician,
      sla_deadline: hoursAgo(48),
      resolved_at:  hoursAgo(20),      // within last 7 days — counted in dashboard stat
    },
    // resolved — second resolved ticket this week
    {
      title:       'Password expiry emails going to spam',
      description: 'Multiple staff members report that the automated password expiry notifications land in spam rather than the inbox.',
      status:      'resolved' as const,
      priority:    'medium'   as const,
      category_id: cat('Email & Communication'),
      created_by:  ids.admin,
      assigned_to: ids.technician,
      sla_deadline: hoursAgo(72),
      resolved_at:  hoursAgo(30),      // within last 7 days — counted in dashboard stat
    },
    // closed
    {
      title:       'Additional storage needed on department network drive',
      description: 'The shared drive is at 98% capacity. We need at least 50 GB more to store final semester project files.',
      status:      'closed' as const,
      priority:    'low'    as const,
      category_id: cat('Access & Accounts'),
      created_by:  ids.staff,
      assigned_to: ids.technician,
      sla_deadline: hoursAgo(120),
      resolved_at:  hoursAgo(96),
    },
  ]

  const { data: createdTickets, error: ticketErr } = await db
    .from('tickets')
    .insert(tickets)
    .select('id')

  if (ticketErr) { console.error('\nTickets failed:', ticketErr.message); return }
  console.log(`  ${createdTickets?.length ?? 0} tickets created`)

  // --- Comments ---
  if (!createdTickets || createdTickets.length < 9) {
    console.log('\nNot enough tickets to attach comments — skipping.')
  } else {
    const tid = (i: number) => createdTickets[i]!.id

    const comments = [
      // Ticket 0 — WiFi down (in_progress)
      {
        ticket_id:   tid(0),
        author_id:   ids.technician,
        body:        'Identified the cause — the main access point switch in LB-3 has lost power. Bringing a replacement unit now. ETA 30 minutes.',
        is_internal: false,
      },
      {
        ticket_id:   tid(0),
        author_id:   ids.technician,
        // Third failure this month — worth flagging for a wider audit, not just a quick fix
        body:        'Third switch failure in this block this month. Flagging for infrastructure audit before next semester starts.',
        is_internal: true,
      },
      {
        ticket_id:   tid(0),
        author_id:   ids.student,
        body:        'Thank you for the update. Will there be a warning before the switch restarts so we can save our work?',
        is_internal: false,
      },
      // Ticket 6 — Office not activating (in_progress)
      {
        ticket_id:   tid(6),
        author_id:   ids.technician,
        body:        'Open Office, go to File → Account → Activate Product, then sign in with your full @ktu.edu.gh address. Let me know what message you see.',
        is_internal: false,
      },
      {
        ticket_id:   tid(6),
        author_id:   ids.staff,
        body:        'Tried that — it says my account has no licence assigned. I am signing in with abena.osei@ktu.edu.gh.',
        is_internal: false,
      },
      {
        ticket_id:   tid(6),
        author_id:   ids.technician,
        body:        'Found the issue — the licence was not assigned in the admin portal. Fixed now. Please sign out of Office completely, then sign back in.',
        is_internal: false,
      },
      // Ticket 8 — Projector (pending)
      {
        ticket_id:   tid(8),
        author_id:   ids.technician,
        body:        'Visited LT3 — the HDMI board on the projector is faulty. Replacement part ordered, expected Thursday. Will update once installed.',
        is_internal: false,
      },
      {
        ticket_id:   tid(8),
        author_id:   ids.staff,
        body:        'Noted, thank you. My Thursday lectures are at 10am and 2pm — can the repair happen before 10am?',
        is_internal: false,
      },
    ]

    const { error: commentErr } = await db.from('comments').insert(comments)
    if (commentErr) console.error('\nComments failed:', commentErr.message)
    else console.log(`  ${comments.length} comments created`)
  }

  console.log('\n--- Seed complete ---')
  console.log('Test accounts (password for all: Test1234!)\n')
  for (const u of TEST_USERS) {
    console.log(`  ${u.role.padEnd(11)}  ${u.email}`)
  }
  console.log()
}

seed().catch(console.error)
