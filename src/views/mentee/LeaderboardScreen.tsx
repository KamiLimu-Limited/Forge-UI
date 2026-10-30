import { LeaderboardList } from '@/components/forge/LeaderboardList'
import { PageHeader } from '@/components/layout/PageHeader'
import { Chip } from '@/components/ui/Chip'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { myStanding } from '@/lib/leaderboard'
import { RANK_BOARDS } from '@/lib/menteeDashboard'
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
      <div
        role="group"
        aria-label="Choose a leaderboard"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0"
      >
        {RANK_BOARDS.map((board) => (
          <Chip
            key={board.dimension}
            variant={board.dimension === dimension ? 'on' : 'default'}
            pressed={board.dimension === dimension}
            onClick={() => onDimensionChange(board.dimension)}
          >
            {board.label}
          </Chip>
        ))}
      </div>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !entries ? (
        <LoadingState label="Loading the leaderboard" />
      ) : (
        <LeaderboardList key={dimension} dimension={dimension} entries={entries} />
      )}
    </div>
  )
}
