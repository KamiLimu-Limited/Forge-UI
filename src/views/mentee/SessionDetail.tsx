'use client'

import { useMenteeSessionDetail } from '@/hooks/useMenteeSessionDetail'
import { SessionDetailScreen } from './SessionDetailScreen'

interface SessionDetailProps {
  sessionId: string
}

// Loads one session and hands it to the screen
export function SessionDetail({ sessionId }: SessionDetailProps) {
  const { data, isLoading, error, refetch } = useMenteeSessionDetail(sessionId)
  return (
    <SessionDetailScreen session={data} isLoading={isLoading} error={error} onRetry={refetch} />
  )
}
