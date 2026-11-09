import { LeaderboardList } from '@/components/forge/LeaderboardList'
import { Chip } from '@/components/ui/Chip'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { RANK_BOARDS } from '@/lib/menteeDashboard'
import type { DimensionEntry, LeaderboardDimension } from '@/types/leaderboard'

interface LeaderboardBoardsProps {
  dimension: LeaderboardDimension
  onDimensionChange: (dimension: LeaderboardDimension) => void
  // null until the board loads
  entries: DimensionEntry[] | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// The mentee boards: a chip per board, then the chosen board's list
export function LeaderboardBoards({
  dimension,
  onDimensionChange,
  entries,
  isLoading = false,
  error = null,
  onRetry,
}: LeaderboardBoardsProps) {
  return (
    <>
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
    </>
  )
}
