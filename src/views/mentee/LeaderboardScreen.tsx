import { LeaderboardBoards } from '@/components/forge/LeaderboardBoards'
import { PageHeader } from '@/components/layout/PageHeader'
import { myStanding } from '@/lib/leaderboard'
import type { DimensionEntry, LeaderboardDimension } from '@/types/leaderboard'

interface LeaderboardScreenProps {
  dimension: LeaderboardDimension
  onDimensionChange: (dimension: LeaderboardDimension) => void
  // null until the board loads
  entries: DimensionEntry[] | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// The mentee leaderboard. This only draws the screen; the page's hook loads each board.
export function LeaderboardScreen({
  dimension,
  onDimensionChange,
  entries,
  isLoading = false,
  error = null,
  onRetry,
}: LeaderboardScreenProps) {
  const standing = entries ? myStanding(entries, dimension) : null

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Leaderboard"
        subtitle={standing ? <span className="hidden md:inline">{standing}</span> : undefined}
      />
      <LeaderboardBoards
        dimension={dimension}
        onDimensionChange={onDimensionChange}
        entries={entries}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
      />
    </div>
  )
}
