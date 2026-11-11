'use client'

import { useState } from 'react'
import { useActiveView } from '@/hooks/useActiveView'
import { useMenteeLeaderboard } from '@/hooks/useMenteeLeaderboard'
import { usePeerMentorBoard } from '@/hooks/usePeerMentorBoard'
import { PeerLeaderboardScreen, type PeerLeaderboardTab } from './PeerLeaderboardScreen'

export function PeerLeaderboard() {
  const [tab, setTab] = useState<PeerLeaderboardTab>('peer-mentors')
  const { cohortId } = useActiveView()
  const board = useMenteeLeaderboard()
  const peers = usePeerMentorBoard(cohortId)
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
      peerRankedBy={peers.rankedBy}
      onPeerRankedByChange={peers.setRankedBy}
      peerEntries={peers.entries}
      peerLoading={peers.isLoading}
      peerError={peers.error}
      onPeerRetry={peers.refetch}
    />
  )
}
