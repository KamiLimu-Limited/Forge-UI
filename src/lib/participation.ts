// =============================================================================
// Who is taking part in sessions, activities and objectives: a mentee, or a 1:1 peer mentor
// using the same screens. The API only lets mentees save, so peer mentors see the screens
// with saving switched off. See docs/api-gaps.md.
// =============================================================================

import type { UserProfileResponse } from '@/types/auth'

export type ParticipantRole = 'mentee' | 'peer_mentor'

export const PEER_MENTOR_SAVE_NOTE =
  "Not available yet. Peer mentors can't save attendance, notes, activities or ratings until the system supports it."

// Someone can be a mentee in one cohort and a peer mentor in a later one, so the newest wins
export function participantRole(user: UserProfileResponse | null): ParticipantRole | null {
  const newest = [...(user?.roles ?? [])]
    .filter((item) => item.role === 'mentee' || item.role === 'peer_mentor_1:1')
    .sort((a, b) => b.assigned_at.localeCompare(a.assigned_at))[0]?.role
  if (newest === 'mentee') return 'mentee'
  if (newest === 'peer_mentor_1:1') return 'peer_mentor'
  return null
}
