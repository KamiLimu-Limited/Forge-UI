// =============================================================================
// Who is taking part in sessions, activities and objectives: a mentee, or a 1:1 or ICT
// peer mentor using the same screens. The API only lets mentees save, so peer mentors see
// the screens with saving switched off. See docs/api-gaps.md.
// =============================================================================

import type { UserProfileResponse, UserRole } from '@/types/auth'

export type ParticipantRole = 'mentee' | 'peer_mentor' | 'ict_peer_mentor'

export interface Participation {
  role: ParticipantRole
  // The cohort of that role
  cohortId: string | null
}

const ROLES: Partial<Record<UserRole, ParticipantRole>> = {
  mentee: 'mentee',
  'peer_mentor_1:1': 'peer_mentor',
  peer_mentor_ict: 'ict_peer_mentor',
}

export const PEER_MENTOR_SAVE_NOTE =
  "Not available yet. Peer mentors can't save attendance, notes, activities or ratings until the system supports it."

// Someone can be a mentee in one cohort and a peer mentor in a later one, so the newest wins
export function participation(user: UserProfileResponse | null): Participation | null {
  const newest = [...(user?.roles ?? [])]
    .filter((item) => ROLES[item.role] !== undefined)
    .sort((a, b) => b.assigned_at.localeCompare(a.assigned_at))[0]
  const role = newest ? ROLES[newest.role] : undefined
  return role ? { role, cohortId: newest.cohort_id } : null
}
