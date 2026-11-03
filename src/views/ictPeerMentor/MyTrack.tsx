'use client'

import { useMyTrack } from '@/hooks/useIctTrack'
import { MyTrackScreen } from './MyTrackScreen'

// Loads the ICT peer mentor's track and hands it to the screen
export function MyTrack() {
  const { data, isLoading, error, refetch } = useMyTrack()
  return <MyTrackScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
