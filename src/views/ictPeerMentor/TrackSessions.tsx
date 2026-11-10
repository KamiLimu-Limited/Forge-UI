'use client'

import { useTrackSessions } from '@/hooks/useIctTrack'
import { TrackSessionsScreen } from './TrackSessionsScreen'

export function TrackSessions() {
  const { data, isLoading, error, refetch } = useTrackSessions()
  return <TrackSessionsScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
