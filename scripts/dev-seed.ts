// =============================================================================
// Local development seed for the System Admin screens.
//
//   npm run dev:seed
//
// Signs in with FORGE_ADMIN_EMAIL and FORGE_ADMIN_PASSWORD from .env.local and,
// through the API only, makes sure the local database has:
//   - one active cohort with 8 KamiLimu months and 4 ICT tracks,
//   - 6 sessions across the three categories, one of them in the past,
//   - invitations for 3 mentees and 2 peer mentors, using "+alias" addresses
//     on the admin's email domain.
// Everything is looked up by name, title or email first, so running it twice
// creates nothing new. Local use only: it refuses to run against any API that
// isn't on localhost. Nothing in the app or the build depends on it.
// =============================================================================

import { existsSync, readFileSync } from 'node:fs'

interface Page<T> {
  items: T[]
  total_pages: number
}

interface Cohort {
  id: string
  name: string
  status: string
  ict_tracks_offered: string[] | null
}

interface Session {
  id: string
  title: string
}

interface Invitation {
  email: string
}

interface User {
  email: string
}

const COHORT_NAME = 'Local seed cohort'
const ICT_TRACKS = ['Cloud Engineering', 'Software Engineering', 'Data Science', 'Cybersecurity']
const DAY_MS = 24 * 60 * 60 * 1000

function readEnvFile(): Record<string, string> {
  if (!existsSync('.env.local')) return {}
  const values: Record<string, string> = {}
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (match) values[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
  return values
}

const env = { ...readEnvFile(), ...process.env }
const baseUrl = (env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000').replace(/\/+$/, '')
const adminEmail = env.FORGE_ADMIN_EMAIL ?? ''
const adminPassword = env.FORGE_ADMIN_PASSWORD ?? ''

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

let token = ''

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${baseUrl}/api/v1${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${path} failed (${res.status}): ${text}`)
  return (text ? JSON.parse(text) : undefined) as T
}

async function all<T>(path: string): Promise<T[]> {
  const join = path.includes('?') ? '&' : '?'
  const first = await call<Page<T>>('GET', `${path}${join}page=1&page_size=100`)
  const items = [...first.items]
  for (let page = 2; page <= first.total_pages; page++) {
    items.push(...(await call<Page<T>>('GET', `${path}${join}page=${page}&page_size=100`)).items)
  }
  return items
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// Eight four-week months, the third of which contains today
function monthBoundaries(): { month: number; name: null; start: string; end: string }[] {
  const start = new Date(Date.now() - 2 * 28 * DAY_MS - 7 * DAY_MS)
  return Array.from({ length: 8 }, (_, i) => {
    const from = new Date(start.getTime() + i * 28 * DAY_MS)
    const to = new Date(from.getTime() + 27 * DAY_MS)
    return { month: i + 1, name: null, start: isoDate(from), end: isoDate(to) }
  })
}

// A time `days` from now at `hour`:`minute` UTC
function at(days: number, hour: number, minute = 0): string {
  const d = new Date(Date.now() + days * DAY_MS)
  d.setUTCHours(hour, minute, 0, 0)
  return d.toISOString()
}

async function ensureCohort(): Promise<Cohort> {
  const existing = (await all<Cohort>(`/cohorts?search=${encodeURIComponent(COHORT_NAME)}`)).find(
    (c) => c.name === COHORT_NAME
  )
  if (existing) {
    const needsTracks = ICT_TRACKS.some((t) => !(existing.ict_tracks_offered ?? []).includes(t))
    if (existing.status !== 'active' || needsTracks) {
      const tracks = Array.from(new Set([...(existing.ict_tracks_offered ?? []), ...ICT_TRACKS]))
      await call('PATCH', `/cohorts/${existing.id}`, {
        status: 'active',
        ict_tracks_offered: tracks,
      })
      console.log(`  cohort: updated "${COHORT_NAME}"`)
    } else {
      console.log(`  cohort: "${COHORT_NAME}" already exists`)
    }
    return existing
  }
  const months = monthBoundaries()
  const cohort = await call<Cohort>('POST', '/cohorts', {
    name: COHORT_NAME,
    programme_type: 'undergraduate',
    start_date: months[0].start,
    end_date: months[7].end,
    graduation_threshold: 80,
    status: 'active',
    kami_limu_month_boundaries: months,
    ict_tracks_offered: ICT_TRACKS,
  })
  console.log(`  cohort: created "${COHORT_NAME}"`)
  return cohort
}

async function ensureSessions(cohortId: string): Promise<void> {
  const existing = new Set(
    (await all<Session>(`/sessions?cohort_id=${cohortId}`)).map((s) => s.title)
  )
  const sessions = [
    {
      title: 'User Validation and the Competitions Ahead',
      category: 'saturday',
      session_type: 'core',
      starts_at: at(-3, 7),
      duration_minutes: 120,
      status: 'published',
    },
    {
      title: 'Peer Mentorship 4',
      category: 'peer_mentorship',
      session_type: 'peer_mentorship',
      starts_at: at(1, 16),
      duration_minutes: 180,
      status: 'published',
      attendance_deadline: at(2, 9),
    },
    {
      title: 'Cybersecurity: ICT Training 8',
      category: 'thursday',
      session_type: 'ict',
      track: 'Cybersecurity',
      starts_at: at(2, 14, 30),
      duration_minutes: 150,
      status: 'published',
    },
    {
      title: 'General Interview Skills and Career Development',
      category: 'thursday',
      session_type: 'core',
      starts_at: at(9, 14, 30),
      duration_minutes: 150,
      status: 'published',
    },
    {
      title: 'KamiLimu In-Person Sessions',
      category: 'saturday',
      session_type: 'core',
      mode: 'physical',
      location: 'Nairobi',
      starts_at: at(11, 5),
      duration_minutes: 540,
      status: 'published',
    },
    {
      title: 'Innovation Solution Ideation',
      category: 'thursday',
      session_type: 'core',
      starts_at: at(16, 14, 30),
      duration_minutes: 150,
      status: 'draft',
    },
  ]
  for (const session of sessions) {
    if (existing.has(session.title)) {
      console.log(`  session: "${session.title}" already exists`)
      continue
    }
    await call('POST', '/sessions', {
      mode: 'virtual',
      points: 10,
      ...session,
      cohort_id: cohortId,
    })
    console.log(`  session: created "${session.title}"`)
  }
}

async function ensureInvitations(cohortId: string): Promise<void> {
  const [local, domain] = adminEmail.split('@')
  const people = [
    { alias: 'seed-mentee1', first_name: 'Seed', last_name: 'Mentee One', roles: ['mentee'] },
    { alias: 'seed-mentee2', first_name: 'Seed', last_name: 'Mentee Two', roles: ['mentee'] },
    { alias: 'seed-mentee3', first_name: 'Seed', last_name: 'Mentee Three', roles: ['mentee'] },
    {
      alias: 'seed-peer1',
      first_name: 'Seed',
      last_name: 'Peer Mentor',
      roles: ['peer_mentor_1:1'],
    },
    {
      alias: 'seed-ict1',
      first_name: 'Seed',
      last_name: 'ICT Peer Mentor',
      roles: ['peer_mentor_ict'],
    },
  ]
  const invited = new Set(
    (await all<Invitation>('/admin/invitations?pending_only=false')).map((i) =>
      i.email.toLowerCase()
    )
  )
  for (const person of people) {
    const email = `${local.split('+')[0]}+${person.alias}@${domain}`.toLowerCase()
    const users = await all<User>(`/admin/users?search=${encodeURIComponent(email)}`)
    if (invited.has(email) || users.some((u) => u.email.toLowerCase() === email)) {
      console.log(`  invitation: ${email} already exists`)
      continue
    }
    await call('POST', '/auth/invite', {
      email,
      first_name: person.first_name,
      last_name: person.last_name,
      roles: person.roles,
      cohort_id: cohortId,
    })
    console.log(`  invitation: sent to ${email}`)
  }
}

async function main(): Promise<void> {
  if (!adminEmail || !adminPassword) {
    fail(
      'Add FORGE_ADMIN_EMAIL and FORGE_ADMIN_PASSWORD to .env.local (never commit them), then run this again.'
    )
  }
  if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(baseUrl)) {
    fail(`Refusing to seed ${baseUrl}. This script only runs against a local API.`)
  }

  console.log(`Seeding ${baseUrl} as ${adminEmail}`)
  const tokens = await call<{ access_token: string }>('POST', '/auth/login', {
    email: adminEmail,
    password: adminPassword,
  })
  token = tokens.access_token

  const cohort = await ensureCohort()
  await ensureSessions(cohort.id)
  await ensureInvitations(cohort.id)
  console.log("Done. Open http://localhost:3000/admin and pick the seed cohort if it isn't active.")
  console.log('Activation links for the invitations: npm run dev:links -- <email>')
}

main().catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)))
