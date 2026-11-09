'use client'

import { usePeerTasks } from '@/hooks/usePeerTasks'
import { DELIVERY_LEAD_ROUTES } from '@/lib/committeeRoutes'
import { PeerTasksScreen } from './PeerTasksScreen'

export function PeerTasks() {
  const query = usePeerTasks()
  return (
    <PeerTasksScreen
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      onRetry={query.refetch}
      hasCohort={query.hasCohort}
      groupMeetingsHref={DELIVERY_LEAD_ROUTES.groupMeetings}
    />
  )
}
