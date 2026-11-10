'use client'

import { useState } from 'react'
import { useCohortLeaderboard } from '@/hooks/useCommittee'
import { CommitteeLeaderboardsScreen, type CommitteeBoardTab } from './CommitteeLeaderboardsScreen'

export function CommitteeLeaderboards() {
  const [tab, setTab] = useState<CommitteeBoardTab>('mentees')
  const board = useCohortLeaderboard()
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
      onExport={board.download}
      downloading={board.downloading}
    />
  )
}
