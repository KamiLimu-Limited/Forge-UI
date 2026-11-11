'use client'

import { useUpdateApplication } from '@/hooks/useUpdateApplication'
import { UpdateApplicationScreen } from './UpdateApplicationScreen'

interface UpdateApplicationProps {
  activityId: string
}

export function UpdateApplication({ activityId }: UpdateApplicationProps) {
  const form = useUpdateApplication(activityId)
  return (
    <UpdateApplicationScreen
      application={form.application}
      isLoading={form.isLoading}
      error={form.error}
      onRetry={form.refetch}
      stage={form.stage}
      onStageChange={form.setStage}
      finalOutcome={form.finalOutcome}
      onFinalOutcomeChange={form.setFinalOutcome}
      onSave={() => void form.save()}
      isSaving={form.isSaving}
      saveError={form.saveError}
    />
  )
}
