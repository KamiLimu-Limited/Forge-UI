'use client'

import { useMeetSession } from '@/hooks/useMeetSession'
import { MeetUnmatchedScreen } from './MeetUnmatchedScreen'

interface MeetUnmatchedProps {
  sessionId: string
}

export function MeetUnmatched({ sessionId }: MeetUnmatchedProps) {
  const session = useMeetSession(sessionId)
  return (
    <MeetUnmatchedScreen
      sessionId={sessionId}
      session={session.data}
      isLoading={session.isLoading}
      error={session.error}
      onRetry={session.refetch}
    />
  )
}
