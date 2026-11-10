'use client'

import { useParticipantRole } from '@/hooks/useParticipantRole'
import { useMenteeObjectives } from '@/hooks/useMenteeObjectives'
import { useSaveObjectives } from '@/hooks/useSaveObjectives'
import { ObjectivesScreen } from './ObjectivesScreen'

export function Objectives() {
  const participant = useParticipantRole()
  const { data, isLoading, error, refetch } = useMenteeObjectives(participant)
  const { save, isSaving, error: saveError } = useSaveObjectives(data, refetch)
  return (
    <ObjectivesScreen
      data={data}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      onSave={(ratings) => void save(ratings)}
      isSaving={isSaving}
      saveError={saveError}
      saveBlockedNote={participant.saveBlockedNote}
    />
  )
}
