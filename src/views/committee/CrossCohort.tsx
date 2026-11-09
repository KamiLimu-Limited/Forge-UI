'use client'

import { useCrossCohort } from '@/hooks/useCommittee'
import { CrossCohortScreen } from './CrossCohortScreen'

export function CrossCohort() {
  const query = useCrossCohort()
  return (
    <CrossCohortScreen
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      onRetry={query.refetch}
      hasCohort={query.hasCohort}
      onCompareWith={query.setOtherId}
    />
  )
}
