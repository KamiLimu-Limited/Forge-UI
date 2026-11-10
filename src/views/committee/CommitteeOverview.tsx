'use client'

import { useCommitteeOverview } from '@/hooks/useCommittee'
import { COMMITTEE_ROUTES } from '@/lib/committeeRoutes'
import { CommitteeOverviewScreen } from './CommitteeOverviewScreen'

export function CommitteeOverview() {
  const query = useCommitteeOverview()
  return (
    <CommitteeOverviewScreen
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      onRetry={query.refetch}
      hasCohort={query.hasCohort}
      trendsHref={COMMITTEE_ROUTES.trends}
    />
  )
}
