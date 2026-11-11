import type { IconName } from '@/components/ui/Icon'
import { ADMIN_ROUTES, PROGRAM_LEAD_ROUTES } from '@/lib/adminRoutes'
import { ALUMNI_ROUTES } from '@/lib/alumniRoutes'
import { COMMITTEE_ROUTES, DELIVERY_LEAD_ROUTES } from '@/lib/committeeRoutes'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import { ICT_PEER_MENTOR_ROUTES, PEER_MENTOR_ROUTES } from '@/lib/peerMentorRoutes'
import { PRO_MENTOR_ROUTES } from '@/lib/proMentorRoutes'
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

// Peer mentors take part through the mentee screens, with saving switched off until the
// API lets them save
const PARTICIPATION_NAV: NavGroup = {
  heading: 'My participation',
  items: [
    { label: 'Sessions', href: MENTEE_ROUTES.sessions, icon: 'calendar' },
    { label: 'Activities', href: MENTEE_ROUTES.activities, icon: 'inbox' },
    { label: 'Objectives', href: MENTEE_ROUTES.objectives, icon: 'target' },
  ],
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
  peer_mentor_1_1: [
    {
      heading: 'As a peer mentor',
      items: [
        { label: 'My mentees', href: PEER_MENTOR_ROUTES.home, icon: 'users' },
        { label: 'Group meeting', href: PEER_MENTOR_ROUTES.groupMeeting, icon: 'calendar' },
        { label: 'Facilitator view', href: PEER_MENTOR_ROUTES.facilitator, icon: 'chart' },
        { label: 'Leaderboards', href: PEER_MENTOR_ROUTES.leaderboards, icon: 'star' },
      ],
    },
    PARTICIPATION_NAV,
  ],
  peer_mentor_ict: [
    {
      heading: 'As an ICT peer mentor',
      items: [
        { label: 'My track', href: ICT_PEER_MENTOR_ROUTES.track, icon: 'code' },
        { label: 'ICT sessions', href: ICT_PEER_MENTOR_ROUTES.trackSessions, icon: 'calendar' },
        { label: 'Leaderboards', href: PEER_MENTOR_ROUTES.leaderboards, icon: 'star' },
      ],
    },
    PARTICIPATION_NAV,
  ],
  professional_mentor: {
    heading: 'As a professional mentor',
    items: [
      { label: 'My sessions', href: PRO_MENTOR_ROUTES.home, icon: 'calendar' },
      { label: 'Feedback', href: PRO_MENTOR_ROUTES.feedback, icon: 'chart' },
      { label: 'Resources', href: PRO_MENTOR_ROUTES.resources, icon: 'inbox' },
    ],
  },
  committee: {
    heading: 'As a committee member',
    items: [
      { label: 'Overview', href: COMMITTEE_ROUTES.home, icon: 'home' },
      { label: 'Trends', href: COMMITTEE_ROUTES.trends, icon: 'chart' },
      { label: 'Cross-cohort', href: COMMITTEE_ROUTES.crossCohort, icon: 'swap' },
      { label: 'Leaderboards and exports', href: COMMITTEE_ROUTES.leaderboards, icon: 'star' },
    ],
  },
  // The one committee member who can change something: peer mentorship tasks
  program_delivery_lead: {
    heading: 'Program Delivery Lead',
    items: [
      { label: 'Peer mentorship tasks', href: DELIVERY_LEAD_ROUTES.tasks, icon: 'calendar' },
      { label: 'Group meetings', href: DELIVERY_LEAD_ROUTES.groupMeetings, icon: 'users' },
    ],
  },
  program_lead: {
    heading: 'As the Program Lead',
    items: [{ label: 'Admin', href: '/admin', icon: 'home' }],
  },
  alumni: {
    heading: 'As an alumnus',
    items: [
      { label: 'Home', href: ALUMNI_ROUTES.home, icon: 'home' },
      { label: 'History', href: ALUMNI_ROUTES.history, icon: 'clock' },
    ],
  },
}

// The System Admin sidebar and mobile menu, in design order (SA-Broadcast)
export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    heading: '',
    items: [
      { label: 'Overview', href: ADMIN_ROUTES.home, icon: 'home' },
      { label: 'All cohorts', href: '/admin/cohorts', icon: 'inbox' },
      { label: 'Sessions', href: '/admin/sessions', icon: 'calendar' },
      { label: 'Group meetings', href: ADMIN_ROUTES.groupMeetings, icon: 'users' },
      { label: 'Attendance queue', href: '/admin/attendance-queue', icon: 'inbox' },
      { label: 'Extra activities', href: '/admin/extra-activities', icon: 'check' },
      { label: 'Users', href: '/admin/users', icon: 'users' },
      { label: 'ICT tracks', href: '/admin/ict-tracks', icon: 'swap' },
      { label: 'Mentor assignments', href: '/admin/assignments', icon: 'users' },
      { label: 'Rosters', href: '/admin/rosters/professional-mentors', icon: 'user' },
      { label: 'Cohort settings', href: '/admin/settings', icon: 'menu' },
      { label: 'Graduation preview', href: PROGRAM_LEAD_ROUTES.graduation, icon: 'star' },
      { label: 'Audit trail', href: '/admin/audit-trail', icon: 'search' },
    ],
  },
  {
    heading: 'Messages and integrations',
    items: [
      { label: 'Messages', href: ADMIN_ROUTES.messages, icon: 'bell' },
      { label: 'Email delivery', href: ADMIN_ROUTES.emailDelivery, icon: 'inbox' },
      { label: 'Google sync', href: ADMIN_ROUTES.googleSync, icon: 'calendar' },
    ],
  },
]

// The Program Lead's sidebar, in design order (PL-Home): the System Admin screens plus
// Graduation and the committee's oversight screens
export const PROGRAM_LEAD_NAV_GROUPS: NavGroup[] = [
  {
    heading: '',
    items: [
      { label: 'Overview', href: ADMIN_ROUTES.home, icon: 'home' },
      { label: 'Graduation', href: PROGRAM_LEAD_ROUTES.graduation, icon: 'star' },
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
    ],
  },
  {
    heading: 'Oversight',
    items: [
      { label: 'Trends', href: PROGRAM_LEAD_ROUTES.trends, icon: 'chart' },
      { label: 'Cross-cohort', href: PROGRAM_LEAD_ROUTES.crossCohort, icon: 'swap' },
      { label: 'Leaderboards and exports', href: PROGRAM_LEAD_ROUTES.leaderboards, icon: 'star' },
    ],
  },
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
