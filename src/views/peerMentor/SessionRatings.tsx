'use client'

import { useSessionRatings } from '@/hooks/useFacilitator'
import { SessionRatingsScreen } from './SessionRatingsScreen'

interface SessionRatingsProps {
  sessionId: string
}

export function SessionRatings({ sessionId }: SessionRatingsProps) {
  const { data, isLoading, error, refetch } = useSessionRatings(sessionId)
  return <SessionRatingsScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
