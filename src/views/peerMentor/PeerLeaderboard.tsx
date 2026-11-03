'use client'

import { useState } from 'react'
import { useMenteeLeaderboard } from '@/hooks/useMenteeLeaderboard'
import { api } from '@/lib/api'
import { PeerLeaderboardScreen, type PeerLeaderboardTab } from './PeerLeaderboardScreen'

// The mentee overview refuses peer mentors, so the cohort comes from their group
function groupCohortId(): Promise<string> {
  return api.peerMentor.group().then((group) => group.cohort_id)
}

// Loads the mentee boards and hands them to the screen. Mentees opens first, since the
// peer mentor board isn't available yet.
export function PeerLeaderboard() {
  const [tab, setTab] = useState<PeerLeaderboardTab>('mentees')
  const board = useMenteeLeaderboard(groupCohortId)
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
