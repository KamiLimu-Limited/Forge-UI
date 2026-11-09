'use client'

import { useParticipantRole } from '@/hooks/useParticipantRole'
import { useMenteeActivities } from '@/hooks/useMenteeActivities'
import { ActivitiesScreen } from './ActivitiesScreen'

// Loads the mentee's activities and hands them to the screen
export function Activities() {
  const participant = useParticipantRole()
  const { data, isLoading, error, refetch } = useMenteeActivities(participant)
  return (
    <ActivitiesScreen
      data={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      saveBlockedNote={participant.saveBlockedNote}
    />
  )
}
