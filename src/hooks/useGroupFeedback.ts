'use client'

import { loadGroupFeedback } from '@/lib/peerMentor'
import type { GroupFeedbackView } from '@/types/peerMentor'
import { useActiveView } from './useActiveView'
import { useApiQuery, type ApiQuery } from './useApiQuery'

export function useGroupFeedback(sessionId: string): ApiQuery<GroupFeedbackView> {
  const { cohortId } = useActiveView()
  return useApiQuery(() => loadGroupFeedback(sessionId, cohortId), [sessionId, cohortId], {
    fallbackError: "We couldn't load your group's feedback. Try again.",
  })
}
