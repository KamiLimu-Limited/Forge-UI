// Who is taking part in sessions, activities and objectives: a mentee, or a 1:1 or ICT
// peer mentor using the same screens. The API only lets mentees save, so peer mentors see
// the screens with saving switched off. See docs/api-gaps.md. Which role and cohort a
// screen shows comes from hooks/useActiveView.ts.

export type ParticipantRole = 'mentee' | 'peer_mentor' | 'ict_peer_mentor'

export const PEER_MENTOR_SAVE_NOTE =
  "Not available yet. Peer mentors can't save attendance, notes, activities or ratings until the system supports it."
