'use client'

import { loadGroupFeedback } from '@/lib/peerMentor'
import type { GroupFeedbackView } from '@/types/peerMentor'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export function useGroupFeedback(sessionId: string): ApiQuery<GroupFeedbackView> {
  return useApiQuery(() => loadGroupFeedback(sessionId), [sessionId], {
    fallbackError: "We couldn't load your group's feedback. Try again.",
  })
}
