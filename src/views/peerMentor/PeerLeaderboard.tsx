'use client'

import { useState } from 'react'
import { useMenteeLeaderboard } from '@/hooks/useMenteeLeaderboard'
import { PeerLeaderboardScreen, type PeerLeaderboardTab } from './PeerLeaderboardScreen'

// Mentees opens first, since the peer mentor board isn't available yet.
export function PeerLeaderboard() {
  const [tab, setTab] = useState<PeerLeaderboardTab>('mentees')
  const board = useMenteeLeaderboard()
  return (
    <PeerLeaderboardScreen
      tab={tab}
      onTabChange={setTab}
      dimension={board.dimension}
      onDimensionChange={board.setDimension}
      entries={board.entries}
      isLoading={board.isLoading}
      error={board.error}
      onRetry={board.refetch}
    />
  )
}
