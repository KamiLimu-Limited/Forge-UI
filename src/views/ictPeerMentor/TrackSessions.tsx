'use client'

import { useTrackSessions } from '@/hooks/useIctTrack'
import { TrackSessionsScreen } from './TrackSessionsScreen'

// Loads the track's sessions and hands them to the screen
export function TrackSessions() {
  const { data, isLoading, error, refetch } = useTrackSessions()
  return <TrackSessionsScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
