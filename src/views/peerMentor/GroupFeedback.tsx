'use client'

import { useGroupFeedback } from '@/hooks/useGroupFeedback'
import { GroupFeedbackScreen } from './GroupFeedbackScreen'

interface GroupFeedbackProps {
  sessionId: string
}

// Loads the group's feedback for one session and hands it to the screen
export function GroupFeedback({ sessionId }: GroupFeedbackProps) {
  const { data, isLoading, error, refetch } = useGroupFeedback(sessionId)
  return <GroupFeedbackScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
