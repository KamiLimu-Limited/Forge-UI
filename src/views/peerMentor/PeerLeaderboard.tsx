'use client'

import { useState } from 'react'
import { useMenteeLeaderboard } from '@/hooks/useMenteeLeaderboard'
import { useParticipantRole } from '@/hooks/useParticipantRole'
import { PeerLeaderboardScreen, type PeerLeaderboardTab } from './PeerLeaderboardScreen'

// Loads the mentee boards and hands them to the screen. Mentees opens first, since the
// peer mentor board isn't available yet.
export function PeerLeaderboard() {
  const [tab, setTab] = useState<PeerLeaderboardTab>('mentees')
  // The mentee overview refuses peer mentors, so the cohort comes from their role
  const { peerCohortId } = useParticipantRole()
  const board = useMenteeLeaderboard(() =>
    peerCohortId ? Promise.resolve(peerCohortId) : Promise.reject(new Error('No cohort'))
  )
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
