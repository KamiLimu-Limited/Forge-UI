'use client'

import { useCorrection } from '@/hooks/useGraduation'
import { CorrectionScreen } from './CorrectionScreen'

export function Correction() {
  const correction = useCorrection()
  return (
    <CorrectionScreen
      data={correction.data}
      isLoading={correction.isLoading}
      error={correction.error}
      onRetry={correction.refetch}
      hasCohort={correction.hasCohort}
      draft={correction.draft}
      onChange={correction.setDraft}
      selected={correction.selected}
      errors={correction.errors}
      onSave={() => void correction.save()}
      isSaving={correction.isSaving}
      saveError={correction.saveError}
    />
  )
}
