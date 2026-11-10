import { LeaderboardBoards } from '@/components/forge/LeaderboardBoards'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { DimensionEntry, LeaderboardDimension } from '@/types/leaderboard'

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
}

// Leaderboards for a 1:1 peer mentor. The API has no peer mentor board yet, so that tab
// says so; the mentee boards are the same as the mentee Leaderboard. See docs/api-gaps.md.
export function PeerLeaderboardScreen({
  tab,
  onTabChange,
  dimension,
  onDimensionChange,
  entries,
  isLoading = false,
  error = null,
  onRetry,
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
        <Card>
          <EmptyState icon="star" title="Not available yet" />
        </Card>
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
