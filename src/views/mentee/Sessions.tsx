'use client'

import { useParticipantRole } from '@/hooks/useParticipantRole'
import { useMenteeSessions } from '@/hooks/useMenteeSessions'
import { SessionsScreen } from './SessionsScreen'

// Loads the mentee's sessions and hands them to the screen
export function Sessions() {
  const { isPeerMentor, saveBlockedNote } = useParticipantRole()
  const { data, isLoading, error, refetch } = useMenteeSessions(isPeerMentor)
  return (
    <SessionsScreen
      data={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      saveBlockedNote={saveBlockedNote}
    />
  )
}
