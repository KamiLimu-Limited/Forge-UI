// Browser-side checks for the user CSV import. The API takes email, first_name, last_name
// and roles (separated by ";"), plus optional profile columns. ICT track and peer mentor
// columns are left out: both are assigned later.

import { DEGREE_LEVEL_LABELS, GENDER_LABELS } from '@/lib/profile'
import { ALL_ROLES } from '@/lib/roles'
import type { UserRole } from '@/types/auth'
import { parseCsv, toCsv } from './csv'

export const ACCEPTED_COLUMNS = ['email', 'first_name', 'last_name', 'roles'] as const

// The optional profile columns, as the API names them
export const PROFILE_COLUMNS = [
  'university',
  'programme_of_study',
  'degree_level',
  'gender',
  'phone',
  'birthday',
  'linkedin',
  'github',
  'instagram',
] as const

// Other names a spreadsheet might use for a column
const COLUMN_ALIASES: Record<string, string> = { programme: 'programme_of_study' }

export interface ImportRow {
  line: number
  email: string
  firstName: string
  lastName: string
  roles: UserRole[]
  profile: Partial<Record<(typeof PROFILE_COLUMNS)[number], string>>
  problems: string[]
}

export interface ParsedImport {
  rows: ImportRow[]
  // Columns present in the file that the API ignores
  ignoredColumns: string[]
  // A problem with the whole file, such as a missing email column
  fileError: string | null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalise(header: string): string {
  const name = header
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
  return COLUMN_ALIASES[name] ?? name
}

export function parseImport(text: string): ParsedImport {
  const table = parseCsv(text)
  if (table.length === 0) return { rows: [], ignoredColumns: [], fileError: 'The file is empty.' }

  const headers = table[0].map(normalise)
  const col = (name: string) => headers.indexOf(name)
  const nameCol = col('name') >= 0 ? col('name') : col('full_name')
  const missing = ['email'].filter((c) => col(c) < 0)
  if (col('first_name') < 0 && nameCol < 0) missing.push('first_name')
  if (col('last_name') < 0 && nameCol < 0) missing.push('last_name')
  if (missing.length > 0) {
    return {
      rows: [],
      ignoredColumns: [],
      fileError: `The file needs these columns: ${missing.join(', ')}. The first row must be the column names.`,
    }
  }

  const known = new Set<string>([...ACCEPTED_COLUMNS, ...PROFILE_COLUMNS, 'name', 'full_name'])
  const ignoredColumns = headers.filter((h) => h && !known.has(h))
  const seen = new Set<string>()

  const rows = table.slice(1).map((cells, index): ImportRow => {
    const get = (i: number) => (i >= 0 ? (cells[i] ?? '').trim() : '')
    let firstName = get(col('first_name'))
    let lastName = get(col('last_name'))
    if ((!firstName || !lastName) && nameCol >= 0) {
      const parts = get(nameCol).split(/\s+/).filter(Boolean)
      firstName = firstName || parts[0] || ''
      lastName = lastName || parts.slice(1).join(' ')
    }
    const email = get(col('email')).toLowerCase()
    const rawRoles = get(col('roles'))
    const roleNames = rawRoles
      ? rawRoles
          .split(/[;|]/)
          .map((r) => r.trim())
          .filter(Boolean)
      : ['mentee']
    const problems: string[] = []

    if (!email) problems.push('Email is missing')
    else if (!EMAIL_PATTERN.test(email)) problems.push('Email is incomplete')
    else if (seen.has(email)) problems.push('This email is already in the file')
    if (email) seen.add(email)
    if (!firstName) problems.push('First name is missing')
    if (!lastName) problems.push('Last name is missing')
    const badRoles = roleNames.filter((r) => !ALL_ROLES.includes(r as UserRole))
    if (badRoles.length > 0) problems.push(`Unknown role: ${badRoles.join(', ')}`)

    const profile: ImportRow['profile'] = {}
    for (const key of PROFILE_COLUMNS) {
      const value = get(col(key))
      if (value) profile[key] = value
    }
    const degree = profile.degree_level?.toLowerCase()
    if (degree && !(degree in DEGREE_LEVEL_LABELS)) {
      problems.push(`Degree level must be one of ${Object.keys(DEGREE_LEVEL_LABELS).join(', ')}`)
    }
    const gender = profile.gender?.toLowerCase()
    if (gender && !(gender in GENDER_LABELS)) {
      problems.push(`Gender must be one of ${Object.keys(GENDER_LABELS).join(', ')}`)
    }
    if (profile.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(profile.birthday)) {
      problems.push('Birthday must be written as YYYY-MM-DD')
    }

    return {
      line: index + 2,
      email,
      firstName,
      lastName,
      roles: roleNames.filter((r): r is UserRole => ALL_ROLES.includes(r as UserRole)),
      profile,
      problems,
    }
  })

  return {
    rows,
    ignoredColumns,
    fileError: rows.length === 0 ? 'The file has column names but no people.' : null,
  }
}

// A file with only the columns the API accepts, for the ready rows
export function buildUploadFile(rows: ImportRow[], fileName: string): File {
  const csv = toCsv([
    [...ACCEPTED_COLUMNS, ...PROFILE_COLUMNS],
    ...rows.map((r) => [
      r.email,
      r.firstName,
      r.lastName,
      r.roles.join(';'),
      ...PROFILE_COLUMNS.map((key) => {
        const value = r.profile[key] ?? ''
        return key === 'degree_level' || key === 'gender' ? value.toLowerCase() : value
      }),
    ]),
  ])
  return new File([csv], fileName.replace(/\.csv$/i, '') + '-ready.csv', { type: 'text/csv' })
}
