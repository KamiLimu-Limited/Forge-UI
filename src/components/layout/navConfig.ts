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
    items: [{ label: 'Users', href: '/admin/users', icon: 'users' }],
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
