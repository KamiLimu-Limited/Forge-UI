'use client'

import { useMenteeLeaderboard } from '@/hooks/useMenteeLeaderboard'
import { LeaderboardScreen } from './LeaderboardScreen'

export function Leaderboard() {
  const board = useMenteeLeaderboard()
  return (
    <LeaderboardScreen
      dimension={board.dimension}
      onDimensionChange={board.setDimension}
      entries={board.entries}
      isLoading={board.isLoading}
      error={board.error}
      onRetry={board.refetch}
    />
  )
}
