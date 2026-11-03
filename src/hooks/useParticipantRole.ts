'use client'

import { PEER_MENTOR_SAVE_NOTE, participation, type ParticipantRole } from '@/lib/participation'
import { useAuth } from './useAuth'

interface UseParticipantRoleReturn {
  role: ParticipantRole | null
  // For 1:1 and ICT peer mentors, the cohort their screens load from; null for mentees
  peerCohortId: string | null
  // Shown on screens that save, and switches their save off, while peer mentors can't save
  saveBlockedNote: string | null
}

export function useParticipantRole(): UseParticipantRoleReturn {
  const { user } = useAuth()
  const current = participation(user)
  const isPeerMentor = current !== null && current.role !== 'mentee'
  return {
    role: current?.role ?? null,
    peerCohortId: isPeerMentor ? current.cohortId : null,
    saveBlockedNote: isPeerMentor ? PEER_MENTOR_SAVE_NOTE : null,
  }
}
