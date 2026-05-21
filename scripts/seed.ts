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

const PASSWORD     = process.env.SEED_PASSWORD ?? 'Password123!'
const hoursFromNow = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString()
const hoursAgo     = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()

const USERS = [
  // ── Students ────────────────────────────────────────────────────────────────
  { email: 'KwameMensah@ktu.edu.gh',    full_name: 'Kwame Mensah',    role: 'student'    as const },
  { email: 'AbenaAsante@ktu.edu.gh',    full_name: 'Abena Asante',    role: 'student'    as const },
  { email: 'KofiBoateng@ktu.edu.gh',    full_name: 'Kofi Boateng',    role: 'student'    as const },
  { email: 'AkosuaNyarko@ktu.edu.gh',   full_name: 'Akosua Nyarko',   role: 'student'    as const },
  { email: 'EmmanuelDarko@ktu.edu.gh',  full_name: 'Emmanuel Darko',  role: 'student'    as const },

  // ── Staff / Lecturers ───────────────────────────────────────────────────────
  { email: 'AbenaOsei@ktu.edu.gh',      full_name: 'Dr. Abena Osei',      role: 'staff' as const, department: 'Computer Science' },
  { email: 'KwasiTetteh@ktu.edu.gh',    full_name: 'Prof. Kwasi Tetteh',  role: 'staff' as const, department: 'Engineering' },
  { email: 'YaaAmponsah@ktu.edu.gh',    full_name: 'Yaa Amponsah',        role: 'staff' as const, department: 'Mathematics' },
  { email: 'SamuelOfori@ktu.edu.gh',    full_name: 'Samuel Ofori',        role: 'staff' as const, department: 'Business' },
  { email: 'AdwoaMensah@ktu.edu.gh',    full_name: 'Adwoa Mensah',        role: 'staff' as const, department: 'Science' },

  // ── Technicians ─────────────────────────────────────────────────────────────
  { email: 'KofiAsante@ktu.edu.gh',     full_name: 'Kofi Asante',    role: 'technician' as const, department: 'IT' },
  { email: 'AmaOwusu@ktu.edu.gh',       full_name: 'Ama Owusu',      role: 'technician' as const, department: 'IT' },
  { email: 'YawMensah@ktu.edu.gh',      full_name: 'Yaw Mensah',     role: 'technician' as const, department: 'Academic' },
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

type SeedUser = {
  email: string
  full_name: string
  role: 'student' | 'staff' | 'technician'
  department?: string
}

async function upsertUser(u: SeedUser) {
  const { data: list } = await db.auth.admin.listUsers()
  const existing = (list?.users ?? []).find((x: { id: string; email?: string }) => x.email === u.email)

  let userId: string

  if (existing) {
    userId = existing.id
    console.log(`  skip    ${u.email}`)
  } else {
    const { data, error } = await db.auth.admin.createUser({
      email:          u.email,
      password:       PASSWORD,
      email_confirm:  true,
      user_metadata:  { full_name: u.full_name },
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

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log('Creating users…')
  const ids: Record<string, string> = {}

  for (const u of USERS) {
    const id = await upsertUser(u)
    if (id) {
      // Key by first name + last name (the part before @)
      const key = u.email.split('@')[0]
      ids[key] = id
      // Also track first of each role for convenience
      if (!ids[u.role]) ids[u.role] = id
    }
  }

  // Shorthand aliases so ticket/comment data below stays readable
  const s1 = ids.KwameMensah
    const s2 = ids.AbenaAsante
    const s3 = ids.KofiBoateng
    const s4 = ids.AkosuaNyarko
    const s5 = ids.EmmanuelDarko
  const f1 = ids.AbenaOsei
    const f2 = ids.KwasiTetteh
    const f3 = ids.YaaAmponsah
    const f4 = ids.SamuelOfori
    const f5 = ids.AdwoaMensah
  const t1 = ids.KofiAsante
    const t2 = ids.AmaOwusu
    const t3 = ids.YawMensah

  // ── Categories ─────────────────────────────────────────────────────────────
  console.log('\nCreating categories…')
  const { data: existingCats } = await db.from('categories').select('id, name')
  const existingNames = new Set(existingCats?.map((c) => c.name) ?? [])
  const toInsert = CATEGORIES.filter((c) => !existingNames.has(c.name))
  if (toInsert.length) {
    const { error } = await db.from('categories').insert(toInsert)
    if (error) { console.error('\nCategories failed:', error.message); return }
  }

  const { data: cats } = await db.from('categories').select('id, name')
  console.log(`  ${cats?.length ?? 0} categories ready`)
  const cat = (name: string) => cats?.find((c) => c.name === name)?.id ?? null

  // ── Tickets ────────────────────────────────────────────────────────────────
  console.log('\nCreating tickets…')
  const tickets = [
    {
      title:       'Campus WiFi down in Library Block',
      description: 'The entire library block lost WiFi this morning. Around 200 students affected and cannot submit assignments.',
      status:      'in_progress' as const, priority: 'critical' as const,
      category_id: cat('Network & Connectivity'),
      created_by: s1, assigned_to: t1,
      sla_deadline: hoursAgo(2),
    },
    {
      title:       'VPN authentication failure from off-campus',
      description: 'Cannot connect to the university VPN from home. Getting "authentication failed" every attempt.',
      status:      'open' as const, priority: 'high' as const,
      category_id: cat('Network & Connectivity'),
      created_by: s2, assigned_to: null,
      sla_deadline: hoursAgo(6),
    },
    {
      title:       'Zoom blocked by antivirus on exam laptops',
      description: 'The university antivirus is blocking Zoom on 15 laptops reserved for online exams next week.',
      status:      'open' as const, priority: 'critical' as const,
      category_id: cat('Software & Applications'),
      created_by: f2, assigned_to: null,
      sla_deadline: hoursAgo(1),
    },
    {
      title:       'Unable to log into student portal after password reset',
      description: 'After resetting my password via the forgot-password link I keep getting "invalid credentials".',
      status:      'open' as const, priority: 'high' as const,
      category_id: cat('Access & Accounts'),
      created_by: s3, assigned_to: null,
      sla_deadline: hoursFromNow(18),
    },
    {
      title:       'Staff room printer showing offline on all workstations',
      description: 'The HP LaserJet in the main staff room shows as offline on every computer.',
      status:      'open' as const, priority: 'medium' as const,
      category_id: cat('Printing & Scanning'),
      created_by: f1, assigned_to: null,
      sla_deadline: hoursFromNow(68),
    },
    {
      title:       'Keyboard replacement needed — workstation B12',
      description: 'Keyboard at workstation B12 in the admin block has keys A, S, and D that no longer register.',
      status:      'open' as const, priority: 'low' as const,
      category_id: cat('Hardware & Equipment'),
      created_by: f3, assigned_to: null,
      sla_deadline: hoursFromNow(160),
    },
    {
      title:       'Microsoft Office not activating on new laptop',
      description: 'New department laptop shows Office 365 as unlicensed. Cannot create or edit documents.',
      status:      'in_progress' as const, priority: 'medium' as const,
      category_id: cat('Software & Applications'),
      created_by: f1, assigned_to: t1,
      sla_deadline: hoursFromNow(48),
    },
    {
      title:       'Computer Lab A — 8–10 minute boot delay on all machines',
      description: 'All 30 computers in Computer Lab A take 8–10 minutes to reach the desktop.',
      status:      'assigned' as const, priority: 'medium' as const,
      category_id: cat('Lab Computers'),
      created_by: f4, assigned_to: t2,
      sla_deadline: hoursFromNow(60),
    },
    {
      title:       'Projector in LT3 not detecting HDMI input',
      description: 'Projector in Lecture Theatre 3 ignores any HDMI source. VGA still works but most modern laptops lack VGA.',
      status:      'pending' as const, priority: 'high' as const,
      category_id: cat('Projectors & AV'),
      created_by: f2, assigned_to: t3,
      sla_deadline: hoursFromNow(4),
    },
    {
      title:       'University email not syncing on mobile device',
      description: 'University email stopped syncing on my iPhone. Removing and re-adding the account still fails.',
      status:      'resolved' as const, priority: 'medium' as const,
      category_id: cat('Email & Communication'),
      created_by: s4, assigned_to: t1,
      sla_deadline: hoursAgo(48), resolved_at: hoursAgo(20),
    },
    {
      title:       'Password expiry emails going to spam',
      description: 'Multiple staff members report that automated password expiry notifications land in spam.',
      status:      'resolved' as const, priority: 'medium' as const,
      category_id: cat('Email & Communication'),
      created_by: f5, assigned_to: t2,
      sla_deadline: hoursAgo(72), resolved_at: hoursAgo(30),
    },
    {
      title:       'Additional storage needed on department network drive',
      description: 'The shared drive is at 98% capacity. We need at least 50 GB more.',
      status:      'closed' as const, priority: 'low' as const,
      category_id: cat('Access & Accounts'),
      created_by: f1, assigned_to: t1,
      sla_deadline: hoursAgo(120), resolved_at: hoursAgo(96),
    },
    {
      title:       'Screen flickering on desktop in Room 204',
      description: 'The monitor connected to the desktop in Room 204 flickers every few seconds. It becomes unusable during lectures.',
      status:      'open' as const, priority: 'medium' as const,
      category_id: cat('Hardware & Equipment'),
      created_by: s5, assigned_to: null,
      sla_deadline: hoursFromNow(72),
    },
    {
      title:       'Cannot access online library resources off-campus',
      description: 'Unable to access JSTOR and other library databases from home even with the VPN connected.',
      status:      'open' as const, priority: 'medium' as const,
      category_id: cat('Access & Accounts'),
      created_by: s1, assigned_to: null,
      sla_deadline: hoursFromNow(40),
    },
    {
      title:       'Lecture recording system not saving to shared drive',
      description: 'This week\'s lecture recordings are saving locally but not syncing to the department shared drive.',
      status:      'assigned' as const, priority: 'high' as const,
      category_id: cat('Software & Applications'),
      created_by: f3, assigned_to: t1,
      sla_deadline: hoursFromNow(8),
    },
  ]

  const { data: createdTickets, error: ticketErr } = await db
    .from('tickets').insert(tickets).select('id')

  if (ticketErr) { console.error('\nTickets failed:', ticketErr.message); return }
  console.log(`  ${createdTickets?.length ?? 0} tickets created`)

  // ── Comments ───────────────────────────────────────────────────────────────
  console.log('\nCreating comments…')
  if (createdTickets && createdTickets.length >= 9) {
    const tid = (i: number) => createdTickets[i]!.id

    const comments = [
      // Ticket 0 — WiFi down
      { ticket_id: tid(0), author_id: t1, is_internal: false,
        body: 'Identified the cause — the main access point switch in LB-3 has lost power. Bringing a replacement unit now. ETA 30 minutes.' },
      { ticket_id: tid(0), author_id: t1, is_internal: true,
        body: 'Third switch failure in this block this month. Flagging for infrastructure audit before next semester.' },
      { ticket_id: tid(0), author_id: s1, is_internal: false,
        body: 'Thank you for the update. Will there be a warning before the switch restarts so we can save our work?' },
      // Ticket 6 — Office not activating
      { ticket_id: tid(6), author_id: t1, is_internal: false,
        body: 'Open Office, go to File → Account → Activate Product, then sign in with your full @ktu.edu.gh address. Let me know what message you see.' },
      { ticket_id: tid(6), author_id: f1, is_internal: false,
        body: 'Tried that — it says my account has no licence assigned. I am signing in with AbenaOsei@ktu.edu.gh.' },
      { ticket_id: tid(6), author_id: t1, is_internal: false,
        body: 'Found the issue — the licence was not assigned in the admin portal. Fixed now. Please sign out of Office completely, then sign back in.' },
      // Ticket 8 — Projector HDMI
      { ticket_id: tid(8), author_id: t3, is_internal: false,
        body: 'Visited LT3 — the HDMI board on the projector is faulty. Replacement part ordered, expected Thursday. Will update once installed.' },
      { ticket_id: tid(8), author_id: f2, is_internal: false,
        body: 'Noted, thank you. My Thursday lectures are at 10 am and 2 pm — can the repair happen before 10 am?' },
      { ticket_id: tid(8), author_id: t3, is_internal: true,
        body: 'Need approval to order the Epson EB-X49 HDMI replacement board (GH₵ 680). Awaiting sign-off before confirming the order.' },
    ]

    const { error: commentErr } = await db.from('comments').insert(comments)
    if (commentErr) console.error('\nComments failed:', commentErr.message)
    else console.log(`  ${comments.length} comments created`)
  }

  // ── Knowledge Base Articles ────────────────────────────────────────────────
  console.log('\nCreating knowledge base articles…')
  const { data: existingArticles } = await db.from('knowledge_articles').select('slug')
  const existingSlugs = new Set(existingArticles?.map((a) => a.slug) ?? [])

  const articles = [
    {
      title:      'How to connect to the KTU VPN',
      slug:       'connect-ktu-vpn',
      published:  true,
      created_by: t1,
      body: `## Connecting to the KTU VPN

The KTU VPN gives you secure access to university systems from off-campus.

### Requirements
- A KTU staff or student account
- The GlobalProtect VPN client (available from IT Services)

### Steps
1. Download and install **GlobalProtect** from the IT portal.
2. Open GlobalProtect and enter the gateway address: \`vpn.ktu.edu.gh\`
3. Sign in with your KTU email and password.
4. Click **Connect**.

### Troubleshooting
- **Authentication failed** — Check your password has not expired.
- **Cannot reach gateway** — Ensure you are not already on-campus (VPN is for off-campus only).
- If problems persist, submit a ticket under the *Network & Connectivity* category.`,
    },
    {
      title:      'How to activate Microsoft Office 365 on your device',
      slug:       'activate-office-365',
      published:  true,
      created_by: t1,
      body: `## Activating Office 365

All KTU students and staff are entitled to free Office 365 licences.

### Steps
1. Open any Office application (Word, Excel, etc.).
2. Go to **File → Account → Sign In**.
3. Enter your KTU email address (\`YourName@ktu.edu.gh\`).
4. When prompted, sign in with your KTU credentials.
5. Office will activate automatically within a few minutes.

### Common Errors
- **No licence assigned** — Contact IT; your licence may not be provisioned yet.
- **Account locked** — Reset your password at the student portal.

Still having issues? Submit a ticket under *Software & Applications*.`,
    },
    {
      title:      'Printing from campus workstations',
      slug:       'campus-printing-guide',
      published:  true,
      created_by: t2,
      body: `## Campus Printing Guide

### Available Printers
Printers are available in the Library, Staff Room, and all departmental labs.

### How to Print
1. Open your document and press **Ctrl + P** (Windows) or **⌘ + P** (Mac).
2. Select the nearest printer from the list.
3. Choose your settings and click **Print**.
4. Collect your document within **15 minutes** — uncollected jobs are deleted automatically.

### Printer Shows Offline?
1. Check the printer is powered on and has paper.
2. On Windows: go to *Settings → Printers & Scanners*, right-click the printer, and choose **See what's printing → Resume**.
3. If the issue persists, raise a ticket under *Printing & Scanning*.

### Printing Quotas
Students receive a monthly quota of **200 pages**. Additional pages can be purchased at the Library help desk.`,
    },
    {
      title:      'Resetting your KTU account password',
      slug:       'reset-ktu-password',
      published:  true,
      created_by: t1,
      body: `## Resetting Your Password

### Self-Service Reset (Recommended)
1. Go to the student portal and click **Forgot Password**.
2. Enter your KTU email address.
3. Check your personal email for a reset link.
4. Follow the link and create a new password.

### Password Requirements
- Minimum **8 characters**
- At least one uppercase letter and one number
- Cannot reuse your last 3 passwords

### Still Locked Out?
Visit the IT Help Desk in person with your student or staff ID.

- **Location:** Block A, Room 101
- **Hours:** Monday – Friday, 8:00 am – 5:00 pm

Or submit a ticket under *Access & Accounts* and an agent will assist remotely.`,
    },
    {
      title:      'Setting up university email on your phone',
      slug:       'setup-email-mobile',
      published:  true,
      created_by: t2,
      body: `## Setting Up University Email on Mobile

### iOS (iPhone / iPad)
1. Go to **Settings → Mail → Accounts → Add Account**.
2. Choose **Microsoft Exchange**.
3. Enter your KTU email and tap **Next**.
4. Enter your password and allow it to configure automatically.

### Android
1. Open **Gmail** → **Add account → Exchange / Office 365**.
2. Enter your KTU email and tap **Next**.
3. Enter your password and follow the setup wizard.

### Server Settings (if manual setup is required)
- **Server:** \`mail.ktu.edu.gh\`
- **Port:** 443
- **Security:** SSL/TLS
- **Username:** Your full KTU email address

### Sync Not Working?
Try removing and re-adding the account. If the issue continues, submit a ticket under *Email & Communication*.`,
    },
    {
      title:      'Using the Student Portal and LMS',
      slug:       'student-portal-guide',
      published:  true,
      created_by: t3,
      body: `## Student Portal & LMS Guide

### Accessing the Portal
Sign in with your KTU email and password at the student portal.

### Common Tasks
- **View timetable** — Dashboard → My Timetable
- **Download course materials** — Courses → Select course → Materials
- **Submit assignments** — Courses → Select course → Assignments
- **Check grades** — Dashboard → My Results

### Mobile Access
The portal is mobile-friendly. Download the **KTU Mobile** app from the App Store or Google Play.

### Troubleshooting
- **Page won't load** — Clear your browser cache (Ctrl + Shift + Delete) and try again.
- **Missing course** — Contact your department admin; enrolment may not yet be processed.
- **Cannot submit assignment** — Check the deadline has not passed. If within deadline, submit a ticket.`,
    },
  ]

  let articlesCreated = 0
  for (const article of articles) {
    if (!existingSlugs.has(article.slug)) {
      const { error: artErr } = await db.from('knowledge_articles').insert(article)
      if (artErr) console.error(`  article error [${article.slug}]: ${artErr.message}`)
      else articlesCreated++
    }
  }
  console.log(`  ${articlesCreated} knowledge base articles created`)

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────')
  console.log('  Seed complete')
  console.log(`  Password for all accounts: ${PASSWORD}`)
  console.log('─────────────────────────────────────────')

  console.log('\nStudents (5):')
  console.log('  KwameMensah@ktu.edu.gh    — Kwame Mensah')
  console.log('  AbenaAsante@ktu.edu.gh    — Abena Asante')
  console.log('  KofiBoateng@ktu.edu.gh    — Kofi Boateng')
  console.log('  AkosuaNyarko@ktu.edu.gh   — Akosua Nyarko')
  console.log('  EmmanuelDarko@ktu.edu.gh  — Emmanuel Darko')

  console.log('\nStaff (5):')
  console.log('  AbenaOsei@ktu.edu.gh      — Dr. Abena Osei      (Computer Science)')
  console.log('  KwasiTetteh@ktu.edu.gh    — Prof. Kwasi Tetteh  (Engineering)')
  console.log('  YaaAmponsah@ktu.edu.gh    — Yaa Amponsah        (Mathematics)')
  console.log('  SamuelOfori@ktu.edu.gh    — Samuel Ofori        (Business)')
  console.log('  AdwoaMensah@ktu.edu.gh    — Adwoa Mensah        (Science)')

  console.log('\nTechnicians (3):')
  console.log('  KofiAsante@ktu.edu.gh     — Kofi Asante  (IT dept)')
  console.log('  AmaOwusu@ktu.edu.gh       — Ama Owusu    (IT dept)')
  console.log('  YawMensah@ktu.edu.gh      — Yaw Mensah   (Academic dept)')
  console.log()
}

seed().catch(console.error)
