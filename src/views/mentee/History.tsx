'use client'

import { useParticipantRole } from '@/hooks/useParticipantRole'
import { useMenteeHistory } from '@/hooks/useMenteeHistory'
import { HistoryScreen } from './HistoryScreen'

// Loads the mentee's session history and hands it to the screen
export function History() {
  const { isPeerMentor, saveBlockedNote } = useParticipantRole()
  const { data, isLoading, error, refetch } = useMenteeHistory(isPeerMentor)
  return (
    <HistoryScreen
      data={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      saveBlockedNote={saveBlockedNote}
    />
  )
}
