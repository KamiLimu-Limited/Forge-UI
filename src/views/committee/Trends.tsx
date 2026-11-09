'use client'

import { useCommitteeTrends } from '@/hooks/useCommittee'
import { TrendsScreen } from './TrendsScreen'

export function Trends() {
  const query = useCommitteeTrends()
  return (
    <TrendsScreen
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      onRetry={query.refetch}
      hasCohort={query.hasCohort}
    />
  )
}
