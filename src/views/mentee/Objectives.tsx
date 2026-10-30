'use client'

import { useMenteeObjectives } from '@/hooks/useMenteeObjectives'
import { useSaveObjectives } from '@/hooks/useSaveObjectives'
import { ObjectivesScreen } from './ObjectivesScreen'

// Loads the mentee's objectives and saves their ratings
export function Objectives() {
  const { data, isLoading, error, refetch } = useMenteeObjectives()
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
    />
  )
}
