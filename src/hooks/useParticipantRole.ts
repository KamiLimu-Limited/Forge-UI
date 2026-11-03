'use client'

import { PEER_MENTOR_SAVE_NOTE, participantRole, type ParticipantRole } from '@/lib/participation'
import { useAuth } from './useAuth'

interface UseParticipantRoleReturn {
  role: ParticipantRole | null
  isPeerMentor: boolean
  // Shown on screens that save, and switches their save off, while peer mentors can't save
  saveBlockedNote: string | null
}

export function useParticipantRole(): UseParticipantRoleReturn {
  const { user } = useAuth()
  const role = participantRole(user)
  const isPeerMentor = role === 'peer_mentor'
  return { role, isPeerMentor, saveBlockedNote: isPeerMentor ? PEER_MENTOR_SAVE_NOTE : null }
}
