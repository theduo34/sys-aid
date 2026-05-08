import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const db = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const PASSWORD     = 'Password123'
const hoursFromNow = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString()
const hoursAgo     = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()

const USERS = [
  // Students
  { email: 'student1@ktu.edu.gh', full_name: 'Kwame Mensah',      role: 'student'    as const },
  { email: 'student2@ktu.edu.gh', full_name: 'Abena Asante',      role: 'student'    as const },
  { email: 'student3@ktu.edu.gh', full_name: 'Kofi Boateng',      role: 'student'    as const },
  { email: 'student4@ktu.edu.gh', full_name: 'Akosua Nyarko',     role: 'student'    as const },
  { email: 'student5@ktu.edu.gh', full_name: 'Emmanuel Darko',    role: 'student'    as const },
  // Staff / Lecturers
  { email: 'staff1@ktu.edu.gh',   full_name: 'Dr. Abena Osei',    role: 'staff'      as const, department: 'Computer Science' },
  { email: 'staff2@ktu.edu.gh',   full_name: 'Prof. Kwasi Tetteh',role: 'staff'      as const, department: 'Engineering' },
  // Technicians
  { email: 'technician1@ktu.edu.gh', full_name: 'Kofi Asante',    role: 'technician' as const, department: 'IT' },
  { email: 'technician2@ktu.edu.gh', full_name: 'Ama Owusu',      role: 'technician' as const, department: 'IT' },
  { email: 'technician3@ktu.edu.gh', full_name: 'Yaw Mensah',     role: 'technician' as const, department: 'Academic' },
  // Admins (max 3)
  { email: 'admin1@ktu.edu.gh', full_name: 'IT Administrator',    role: 'admin'      as const },
  { email: 'admin2@ktu.edu.gh', full_name: 'System Manager',      role: 'admin'      as const },
  { email: 'admin3@ktu.edu.gh', full_name: 'Help Desk Lead',      role: 'admin'      as const },
]

const CATEGORIES = [
  { name: 'Network & Connectivity',   department: 'IT',       default_priority: 'high'   as const },
  { name: 'Hardware & Equipment',     department: 'IT',       default_priority: 'medium' as const },
  { name: 'Software & Applications',  department: 'IT',       default_priority: 'medium' as const },
  { name: 'Email & Communication',    department: 'IT',       default_priority: 'medium' as const },
  { name: 'Access & Accounts',        department: 'IT',       default_priority: 'high'   as const },
  { name: 'Printing & Scanning',      department: 'IT',       default_priority: 'low'    as const },
  { name: 'Projectors & AV',          department: 'Academic', default_priority: 'high'   as const },
  { name: 'Lab Computers',            department: 'Academic', default_priority: 'medium' as const },
]

async function upsertUser(u: typeof USERS[number]) {
  const { data: list } = await db.auth.admin.listUsers()
  const existing = list?.users.find((x) => x.email === u.email)

  let userId: string

  if (existing) {
    userId = existing.id
    console.log(`  skip    ${u.email}`)
  } else {
    const { data, error } = await db.auth.admin.createUser({
      email: u.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: u.full_name },
    })
    if (error) { console.error(`  error   ${u.email}: ${error.message}`); return null }
    userId = data.user.id
    console.log(`  created ${u.email}`)
  }

  const { error: pe } = await db
    .from('profiles')
    .upsert({
      id:         userId,
      full_name:  u.full_name,
      role:       u.role,
      department: 'department' in u ? u.department : null,
    })
  if (pe) console.error(`  profile error ${u.email}: ${pe.message}`)

  return userId
}

async function seed() {
  console.log('Seeding SysAid…\n')

  // --- Users ---
  const ids: Record<string, string> = {}
  for (const u of USERS) {
    const id = await upsertUser(u)
    if (id) {
      // Index by role (first of each role) and by email prefix for convenience
      const prefix = u.email.split('@')[0]
      ids[prefix] = id
      if (!ids[u.role]) ids[u.role] = id
    }
  }

  // --- Categories ---
  const { data: existingCats } = await db.from('categories').select('id, name')
  const existingNames = new Set(existingCats?.map((c) => c.name) ?? [])
  const toInsert = CATEGORIES.filter((c) => !existingNames.has(c.name))
  if (toInsert.length) {
    const { error } = await db.from('categories').insert(toInsert)
    if (error) { console.error('\nCategories failed:', error.message); return }
  }

  const { data: cats } = await db.from('categories').select('id, name')
  console.log(`\n  ${cats?.length ?? 0} categories ready`)
  const cat = (name: string) => cats?.find((c) => c.name === name)?.id ?? null

  // --- Tickets ---
  const tickets = [
    {
      title:       'Campus WiFi down in Library Block',
      description: 'The entire library block lost WiFi this morning. Around 200 students affected and cannot submit assignments.',
      status:      'in_progress' as const, priority: 'critical' as const,
      category_id: cat('Network & Connectivity'),
      created_by: ids.student1, assigned_to: ids.technician1,
      sla_deadline: hoursAgo(2),
    },
    {
      title:       'VPN authentication failure from off-campus',
      description: 'Cannot connect to the university VPN from home. Getting "authentication failed" every attempt.',
      status:      'open' as const, priority: 'high' as const,
      category_id: cat('Network & Connectivity'),
      created_by: ids.student2, assigned_to: null,
      sla_deadline: hoursAgo(6),
    },
    {
      title:       'Zoom blocked by antivirus on exam laptops',
      description: 'The university antivirus is blocking Zoom on 15 laptops reserved for online exams next week.',
      status:      'open' as const, priority: 'critical' as const,
      category_id: cat('Software & Applications'),
      created_by: ids.admin1, assigned_to: null,
      sla_deadline: hoursAgo(1),
    },
    {
      title:       'Unable to log into student portal after password reset',
      description: 'After resetting my password via the forgot-password link I keep getting "invalid credentials".',
      status:      'open' as const, priority: 'high' as const,
      category_id: cat('Access & Accounts'),
      created_by: ids.student3, assigned_to: null,
      sla_deadline: hoursFromNow(18),
    },
    {
      title:       'Staff room printer showing offline on all workstations',
      description: 'The HP LaserJet in the main staff room shows as offline on every computer.',
      status:      'open' as const, priority: 'medium' as const,
      category_id: cat('Printing & Scanning'),
      created_by: ids.staff1, assigned_to: null,
      sla_deadline: hoursFromNow(68),
    },
    {
      title:       'Keyboard replacement needed — workstation B12',
      description: 'Keyboard at workstation B12 in the admin block has keys A, S, and D that no longer register.',
      status:      'open' as const, priority: 'low' as const,
      category_id: cat('Hardware & Equipment'),
      created_by: ids.staff2, assigned_to: null,
      sla_deadline: hoursFromNow(160),
    },
    {
      title:       'Microsoft Office not activating on new laptop',
      description: 'New department laptop shows Office 365 as unlicensed. Cannot create or edit documents.',
      status:      'in_progress' as const, priority: 'medium' as const,
      category_id: cat('Software & Applications'),
      created_by: ids.staff1, assigned_to: ids.technician1,
      sla_deadline: hoursFromNow(48),
    },
    {
      title:       'Computer Lab A — 8–10 minute boot delay on all machines',
      description: 'All 30 computers in Computer Lab A take 8–10 minutes to reach the desktop.',
      status:      'assigned' as const, priority: 'medium' as const,
      category_id: cat('Lab Computers'),
      created_by: ids.admin1, assigned_to: ids.technician2,
      sla_deadline: hoursFromNow(60),
    },
    {
      title:       'Projector in LT3 not detecting HDMI input',
      description: 'Projector in Lecture Theatre 3 ignores any HDMI source. VGA still works but most modern laptops lack VGA.',
      status:      'pending' as const, priority: 'high' as const,
      category_id: cat('Projectors & AV'),
      created_by: ids.staff2, assigned_to: ids.technician3,
      sla_deadline: hoursFromNow(4),
    },
    {
      title:       'University email not syncing on mobile device',
      description: 'University email stopped syncing on my iPhone. Removing and re-adding the account still fails.',
      status:      'resolved' as const, priority: 'medium' as const,
      category_id: cat('Email & Communication'),
      created_by: ids.student4, assigned_to: ids.technician1,
      sla_deadline: hoursAgo(48), resolved_at: hoursAgo(20),
    },
    {
      title:       'Password expiry emails going to spam',
      description: 'Multiple staff members report that automated password expiry notifications land in spam.',
      status:      'resolved' as const, priority: 'medium' as const,
      category_id: cat('Email & Communication'),
      created_by: ids.admin2, assigned_to: ids.technician2,
      sla_deadline: hoursAgo(72), resolved_at: hoursAgo(30),
    },
    {
      title:       'Additional storage needed on department network drive',
      description: 'The shared drive is at 98% capacity. We need at least 50 GB more.',
      status:      'closed' as const, priority: 'low' as const,
      category_id: cat('Access & Accounts'),
      created_by: ids.staff1, assigned_to: ids.technician1,
      sla_deadline: hoursAgo(120), resolved_at: hoursAgo(96),
    },
  ]

  const { data: createdTickets, error: ticketErr } = await db
    .from('tickets').insert(tickets).select('id')

  if (ticketErr) { console.error('\nTickets failed:', ticketErr.message); return }
  console.log(`  ${createdTickets?.length ?? 0} tickets created`)

  // --- Comments ---
  if (createdTickets && createdTickets.length >= 9) {
    const tid = (i: number) => createdTickets[i]!.id

    const comments = [
      { ticket_id: tid(0), author_id: ids.technician1, is_internal: false,
        body: 'Identified the cause — the main access point switch in LB-3 has lost power. Bringing a replacement unit now. ETA 30 minutes.' },
      { ticket_id: tid(0), author_id: ids.technician1, is_internal: true,
        body: 'Third switch failure in this block this month. Flagging for infrastructure audit before next semester.' },
      { ticket_id: tid(0), author_id: ids.student1, is_internal: false,
        body: 'Thank you for the update. Will there be a warning before the switch restarts so we can save our work?' },
      { ticket_id: tid(6), author_id: ids.technician1, is_internal: false,
        body: 'Open Office, go to File → Account → Activate Product, then sign in with your full @ktu.edu.gh address. Let me know what message you see.' },
      { ticket_id: tid(6), author_id: ids.staff1, is_internal: false,
        body: 'Tried that — it says my account has no licence assigned. I am signing in with staff1@ktu.edu.gh.' },
      { ticket_id: tid(6), author_id: ids.technician1, is_internal: false,
        body: 'Found the issue — the licence was not assigned in the admin portal. Fixed now. Please sign out of Office completely, then sign back in.' },
      { ticket_id: tid(8), author_id: ids.technician3, is_internal: false,
        body: 'Visited LT3 — the HDMI board on the projector is faulty. Replacement part ordered, expected Thursday. Will update once installed.' },
      { ticket_id: tid(8), author_id: ids.staff2, is_internal: false,
        body: 'Noted, thank you. My Thursday lectures are at 10 am and 2 pm — can the repair happen before 10 am?' },
    ]

    const { error: commentErr } = await db.from('comments').insert(comments)
    if (commentErr) console.error('\nComments failed:', commentErr.message)
    else console.log(`  ${comments.length} comments created`)
  }

  console.log('\n--- Seed complete ---')
  console.log('All accounts use password: Password123!\n')
  const groups = [
    { label: 'Students',    prefix: 'student',    count: 5 },
    { label: 'Staff',       prefix: 'staff',      count: 2 },
    { label: 'Technicians', prefix: 'technician', count: 3 },
    { label: 'Admins',      prefix: 'admin',      count: 3 },
  ]
  for (const { label, prefix, count } of groups) {
    console.log(`${label}:`)
    for (let i = 1; i <= count; i++) {
      console.log(`  ${prefix}${i}@ktu.edu.gh`)
    }
  }
  console.log()
}

seed().catch(console.error)
