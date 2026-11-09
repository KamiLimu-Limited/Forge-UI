'use client'

import { useState } from 'react'
import { loadGroupMeeting } from '@/lib/peerMentor'
import type { GroupMeetingView, MeetingMode } from '@/types/peerMentor'
import { useApiQuery } from './useApiQuery'

export interface GroupMeetingDraft {
  mode: MeetingMode
  // YYYY-MM-DD
  date: string
  // HH:MM
  startTime: string
  endTime: string
  place: string
}

interface UseGroupMeetingReturn {
  // null when there is no session to plan for
  data: GroupMeetingView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  draft: GroupMeetingDraft
  setDraft: (changes: Partial<GroupMeetingDraft>) => void
}

const EMPTY_DRAFT: GroupMeetingDraft = {
  mode: 'virtual',
  date: '',
  startTime: '',
  endTime: '',
  place: '',
}

// The form is kept here so it's ready to send once the API can save a group meeting.
// See docs/api-gaps.md.
export function useGroupMeeting(): UseGroupMeetingReturn {
  const query = useApiQuery(() => loadGroupMeeting(), [], {
    fallbackError: "We couldn't load your group meeting. Try again.",
  })
  const [draft, setDraftState] = useState<GroupMeetingDraft>(EMPTY_DRAFT)

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    draft,
    setDraft: (changes) => setDraftState((current) => ({ ...current, ...changes })),
  }
}
