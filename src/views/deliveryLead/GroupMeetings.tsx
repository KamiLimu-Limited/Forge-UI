'use client'

import { useGroupMeetings } from '@/hooks/usePeerTasks'
import { GroupMeetingsScreen } from './GroupMeetingsScreen'

export function GroupMeetings() {
  const query = useGroupMeetings()
  return (
    <GroupMeetingsScreen
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      onRetry={query.refetch}
      hasCohort={query.hasCohort}
      onTaskChange={query.setTaskId}
    />
  )
}
