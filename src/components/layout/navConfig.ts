import type { IconName } from '@/components/ui/Icon'
import type { UserRole } from '@/types/auth'

export interface NavItem {
  label: string
  href: string
  icon: IconName
}

export interface NavGroup {
  // Shown above the group only when the user has more than one group, e.g. "As a peer mentor"
  heading: string
  items: NavItem[]
}

// Sidebar and bottom tab links per role. Only routes that exist are listed.
export const NAV_BY_ROLE: Record<UserRole, NavGroup> = {
  admin: {
    heading: 'As an admin',
    items: [
      { label: 'Admin', href: '/admin', icon: 'home' },
      { label: 'Users', href: '/admin/users', icon: 'users' },
    ],
  },
  // Add links here as each role's screens are built, for example:
  // { label: 'Sessions', href: '/sessions', icon: 'home' }
  mentee: { heading: 'As a mentee', items: [] },
  'peer_mentor_1:1': { heading: 'As a peer mentor', items: [] },
  peer_mentor_ict: { heading: 'As an ICT peer mentor', items: [] },
  professional_mentor: { heading: 'As a professional mentor', items: [] },
  committee: { heading: 'As a committee member', items: [] },
  partner: { heading: 'As a partner', items: [] },
  alumni: { heading: 'As an alumnus', items: [] },
}

// The System Admin sidebar and mobile menu, in design order.
// "Graduation preview" ships with the Program Lead screens.
export const ADMIN_NAV: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: 'home' },
  { label: 'All cohorts', href: '/admin/cohorts', icon: 'inbox' },
  { label: 'Sessions', href: '/admin/sessions', icon: 'calendar' },
  { label: 'Attendance queue', href: '/admin/attendance-queue', icon: 'inbox' },
  { label: 'Extra activities', href: '/admin/extra-activities', icon: 'check' },
  { label: 'Users', href: '/admin/users', icon: 'users' },
  { label: 'ICT tracks', href: '/admin/ict-tracks', icon: 'swap' },
  { label: 'Mentor assignments', href: '/admin/assignments', icon: 'users' },
  { label: 'Rosters', href: '/admin/rosters/professional-mentors', icon: 'user' },
  { label: 'Cohort settings', href: '/admin/settings', icon: 'menu' },
  { label: 'Audit trail', href: '/admin/audit-trail', icon: 'search' },
]

// The section a path belongs to, so nested pages keep their nav item highlighted.
// Overview matches /admin exactly; Rosters covers both roster tabs.
export function adminNavMatches(href: string, pathname: string): boolean {
  if (href === '/admin') return pathname === '/admin'
  if (href.startsWith('/admin/rosters')) return pathname.startsWith('/admin/rosters')
  return pathname === href || pathname.startsWith(`${href}/`)
}
