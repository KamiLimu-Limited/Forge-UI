'use client'

import { useChooseTrack } from '@/hooks/useChooseTrack'
import { ChooseTrackScreen } from './ChooseTrackScreen'

// Loads the cohort's ICT tracks and hands them to the screen
export function ChooseTrack() {
  const track = useChooseTrack()
  return (
    <ChooseTrackScreen
      data={track.data}
      isLoading={track.isLoading}
      error={track.error}
      onRetry={track.refetch}
      selected={track.selected}
      onSelect={track.setSelected}
      canSave={track.canSave}
    />
  )
}
