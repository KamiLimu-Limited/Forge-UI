'use client'

import { PEER_MENTOR_SAVE_NOTE, type ParticipantRole } from '@/lib/participation'
import { useActiveView } from './useActiveView'

export interface UseParticipantRoleReturn {
  // The role the active view takes part as; null for views that don't take part
  role: ParticipantRole | null
  // The active view's cohort. Every participant screen loads from it.
  cohortId: string | null
  // For 1:1 and ICT peer mentors, the same cohort; null for mentees
  peerCohortId: string | null
  // Shown on screens that save, and switches their save off, while peer mentors can't save
  saveBlockedNote: string | null
}

// Sessions, activities and objectives for the view picked in "Switch view"
export function useParticipantRole(): UseParticipantRoleReturn {
  const view = useActiveView()
  const role =
    view.role === 'mentee' || view.role === 'peer_mentor' || view.role === 'ict_peer_mentor'
      ? view.role
      : null
  const isPeerMentor = role === 'peer_mentor' || role === 'ict_peer_mentor'
  return {
    role,
    cohortId: view.cohortId,
    peerCohortId: isPeerMentor ? view.cohortId : null,
    saveBlockedNote: isPeerMentor ? PEER_MENTOR_SAVE_NOTE : null,
  }
}
