import type { IconName } from '@/components/ui/Icon'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import { PEER_MENTOR_ROUTES } from '@/lib/peerMentorRoutes'
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

// Sidebar and bottom tab links per role. Only routes that exist are listed. A role with two
// groups, like the peer mentor's own participation, gets its links under two headings.
export const NAV_BY_ROLE: Record<UserRole, NavGroup | NavGroup[]> = {
  admin: {
    heading: 'As an admin',
    items: [
      { label: 'Admin', href: '/admin', icon: 'home' },
      { label: 'Users', href: '/admin/users', icon: 'users' },
    ],
  },
  // Add links here as each role's screens are built, for example:
  // { label: 'Sessions', href: '/sessions', icon: 'home' }
  mentee: {
    heading: 'As a mentee',
    items: [
      { label: 'Home', href: MENTEE_ROUTES.home, icon: 'home' },
      { label: 'Sessions', href: MENTEE_ROUTES.sessions, icon: 'calendar' },
      { label: 'Activities', href: MENTEE_ROUTES.activities, icon: 'star' },
      { label: 'Objectives', href: MENTEE_ROUTES.objectives, icon: 'target' },
      { label: 'Leaderboard', href: MENTEE_ROUTES.leaderboard, icon: 'chart' },
    ],
  },
  'peer_mentor_1:1': [
    {
      heading: 'As a peer mentor',
      items: [
        { label: 'My mentees', href: PEER_MENTOR_ROUTES.home, icon: 'users' },
        { label: 'Facilitator view', href: PEER_MENTOR_ROUTES.facilitator, icon: 'chart' },
        { label: 'Leaderboards', href: PEER_MENTOR_ROUTES.leaderboards, icon: 'star' },
      ],
    },
    {
      // The mentee screens, with saving switched off until the API lets peer mentors save
      heading: 'My participation',
      items: [
        { label: 'Sessions', href: MENTEE_ROUTES.sessions, icon: 'calendar' },
        { label: 'Activities', href: MENTEE_ROUTES.activities, icon: 'inbox' },
        { label: 'Objectives', href: MENTEE_ROUTES.objectives, icon: 'target' },
      ],
    },
  ],
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

// Tabs on the roster and mentor assignment pages
export const ROSTER_TABS = [
  { label: 'Professional mentors', href: '/admin/rosters/professional-mentors' },
  { label: 'Consultants', href: '/admin/rosters/consultants' },
]

export const ASSIGNMENT_TABS = [
  { label: '1:1 peer mentor groups', href: '/admin/assignments' },
  { label: 'ICT peer mentors to tracks', href: '/admin/assignments/ict' },
  { label: 'Professional mentors to sessions', href: '/admin/assignments/professional' },
]
