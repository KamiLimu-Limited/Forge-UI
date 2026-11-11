'use client'

import { AddObjectiveDialog } from '@/components/forge/AddObjectiveDialog'
import { useAddObjective } from '@/hooks/useAddObjective'
import { useParticipantRole } from '@/hooks/useParticipantRole'
import { useMenteeObjectives } from '@/hooks/useMenteeObjectives'
import { useSaveObjectives } from '@/hooks/useSaveObjectives'
import { ObjectivesScreen } from './ObjectivesScreen'

export function Objectives() {
  const participant = useParticipantRole()
  const { data, isLoading, error, refetch } = useMenteeObjectives(participant)
  const { save, isSaving, error: saveError } = useSaveObjectives(data, refetch)
  const add = useAddObjective(data?.cohortId ?? participant.cohortId, refetch)
  return (
    <>
      <ObjectivesScreen
        data={data}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onSave={(ratings) => void save(ratings)}
        isSaving={isSaving}
        saveError={saveError}
        onAddObjective={add.open}
      />
      <AddObjectiveDialog
        isOpen={add.isOpen}
        onClose={add.close}
        type={add.type}
        onTypeChange={add.setType}
        text={add.text}
        onTextChange={add.setText}
        textError={add.textError}
        onSave={() => void add.save()}
        isSaving={add.isSaving}
        saveError={add.saveError}
      />
    </>
  )
}
