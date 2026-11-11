'use client'

import { useState } from 'react'
import { useCohortLeaderboard } from '@/hooks/useCommittee'
import { usePeerMentorBoard } from '@/hooks/usePeerMentorBoard'
import { CommitteeLeaderboardsScreen, type CommitteeBoardTab } from './CommitteeLeaderboardsScreen'

export function CommitteeLeaderboards() {
  const [tab, setTab] = useState<CommitteeBoardTab>('mentees')
  const board = useCohortLeaderboard()
  const peers = usePeerMentorBoard(board.cohortId)
  return (
    <CommitteeLeaderboardsScreen
      hasCohort={board.hasCohort}
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
      onExport={board.download}
      downloading={board.downloading}
      snapshots={board.snapshots}
      snapshotsError={board.snapshotsError}
      onDownloadSnapshot={board.downloadSnapshot}
      onTakeSnapshot={board.canTakeSnapshot ? board.takeSnapshot : undefined}
      isTakingSnapshot={board.isTakingSnapshot}
    />
  )
}
