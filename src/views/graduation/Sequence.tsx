'use client'

import { useGraduationSequence } from '@/hooks/useGraduationSequence'
import { SequenceScreen } from './SequenceScreen'

interface SequenceProps {
  cohortId: string
}

export function Sequence({ cohortId }: SequenceProps) {
  const player = useGraduationSequence(cohortId)
  return (
    <SequenceScreen
      data={player.data}
      isLoading={player.isLoading}
      error={player.error}
      onRetry={player.refetch}
      step={player.step}
      index={player.index}
      count={player.count}
      isPlaying={player.isPlaying}
      reducedMotion={player.reducedMotion}
      isFullscreen={player.isFullscreen}
      onNext={player.next}
      onPrevious={player.previous}
      onTogglePlay={player.togglePlay}
      onReplay={player.replay}
      onToggleFullscreen={player.toggleFullscreen}
    />
  )
}
