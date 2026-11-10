'use client'

import { useMyTrack } from '@/hooks/useIctTrack'
import { MyTrackScreen } from './MyTrackScreen'

export function MyTrack() {
  const { data, isLoading, error, refetch } = useMyTrack()
  return <MyTrackScreen data={data} isLoading={isLoading} error={error} onRetry={refetch} />
}
