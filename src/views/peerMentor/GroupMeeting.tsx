'use client'

import { useGroupMeeting } from '@/hooks/useGroupMeeting'
import { GroupMeetingScreen } from './GroupMeetingScreen'

// Loads the session to plan for and keeps the meeting form, and hands both to the screen
export function GroupMeeting() {
  const meeting = useGroupMeeting()
  return (
    <GroupMeetingScreen
      data={meeting.data}
      isLoading={meeting.isLoading}
      error={meeting.error}
      onRetry={meeting.refetch}
      draft={meeting.draft}
      onDraftChange={meeting.setDraft}
    />
  )
}
