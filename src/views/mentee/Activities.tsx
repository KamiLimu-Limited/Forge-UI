'use client'

import { useMenteeActivities } from '@/hooks/useMenteeActivities'
import { ActivitiesScreen } from './ActivitiesScreen'

// Loads the mentee's activities and hands them to the screen
export function Activities() {
  const { data, isLoading, error, refetch } = useMenteeActivities()
  return <ActivitiesScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
