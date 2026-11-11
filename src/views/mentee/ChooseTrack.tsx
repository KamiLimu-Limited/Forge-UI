'use client'

import { useChooseTrack } from '@/hooks/useChooseTrack'
import { ChooseTrackScreen } from './ChooseTrackScreen'

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
      onSave={() => void track.save()}
      isSaving={track.isSaving}
      saveError={track.saveError}
    />
  )
}
