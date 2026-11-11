import { LeaderboardBoards } from '@/components/forge/LeaderboardBoards'
import { PeerMentorBoard } from '@/components/forge/PeerMentorBoard'
import { PageHeader } from '@/components/layout/PageHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type {
  DimensionEntry,
  LeaderboardDimension,
  PeerMentorDimension,
  PeerMentorRow,
} from '@/types/leaderboard'

export type PeerLeaderboardTab = 'peer-mentors' | 'mentees'

const TABS: { value: PeerLeaderboardTab; label: string }[] = [
  { value: 'peer-mentors', label: 'Peer mentors' },
  { value: 'mentees', label: 'Mentees' },
]

interface PeerLeaderboardScreenProps {
  tab: PeerLeaderboardTab
  onTabChange: (tab: PeerLeaderboardTab) => void
  dimension: LeaderboardDimension
  onDimensionChange: (dimension: LeaderboardDimension) => void
  // The mentee board, null until it loads
  entries: DimensionEntry[] | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  peerRankedBy: PeerMentorDimension
  onPeerRankedByChange: (dimension: PeerMentorDimension) => void
  peerEntries: PeerMentorRow[] | null
  peerLoading?: boolean
  peerError?: string | null
  onPeerRetry?: () => void
}

// Leaderboards for a peer mentor: the peer mentor board with their own place marked, and
// the same mentee boards as the mentee Leaderboard
export function PeerLeaderboardScreen({
  tab,
  onTabChange,
  dimension,
  onDimensionChange,
  entries,
  isLoading = false,
  error = null,
  onRetry,
  peerRankedBy,
  onPeerRankedByChange,
  peerEntries,
  peerLoading = false,
  peerError = null,
  onPeerRetry,
}: PeerLeaderboardScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader title="Leaderboards" />
      <SegmentedControl
        label="Choose whose leaderboard to see"
        options={TABS}
        value={tab}
        onChange={onTabChange}
      />
      {tab === 'peer-mentors' ? (
        <PeerMentorBoard
          rankedBy={peerRankedBy}
          onRankedByChange={onPeerRankedByChange}
          entries={peerEntries}
          isLoading={peerLoading}
          error={peerError}
          onRetry={onPeerRetry}
        />
      ) : (
        <LeaderboardBoards
          dimension={dimension}
          onDimensionChange={onDimensionChange}
          entries={entries}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
        />
      )}
    </div>
  )
}
