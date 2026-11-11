import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { cx } from '@/lib/cx'
import { formatPercentage } from '@/lib/format'
import type { PeerMentorDimension, PeerMentorRow } from '@/types/leaderboard'

interface PeerMentorBoardProps {
  rankedBy: PeerMentorDimension
  onRankedByChange: (dimension: PeerMentorDimension) => void
  // null until the board loads
  entries: PeerMentorRow[] | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export const PEER_MENTOR_BOARDS: { value: PeerMentorDimension; label: string }[] = [
  { value: 'sessions_attended', label: 'Sessions attended' },
  { value: 'extra_sessions', label: 'Extra sessions' },
  { value: 'core_rate', label: 'Core rate' },
  { value: 'overall_rate', label: 'Overall rate' },
]

function Name({ row }: { row: PeerMentorRow }) {
  if (!row.is_me) return <>{row.display_name}</>
  return (
    <>
      <strong className="font-semibold">{row.display_name}</strong> (you)
    </>
  )
}

function rankedValue(row: PeerMentorRow, dimension: PeerMentorDimension): string {
  const value = row[dimension]
  return dimension === 'core_rate' || dimension === 'overall_rate'
    ? (formatPercentage(value) ?? '')
    : String(value)
}

// The peer mentor leaderboard: a chip per ranking, then every peer mentor with all four
// numbers. A list on phones, a table from md up.
export function PeerMentorBoard({
  rankedBy,
  onRankedByChange,
  entries,
  isLoading = false,
  error = null,
  onRetry,
}: PeerMentorBoardProps) {
  return (
    <>
      <div
        role="group"
        aria-label="Rank peer mentors by"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0"
      >
        {PEER_MENTOR_BOARDS.map((board) => (
          <Chip
            key={board.value}
            variant={board.value === rankedBy ? 'on' : 'default'}
            pressed={board.value === rankedBy}
            onClick={() => onRankedByChange(board.value)}
          >
            {board.label}
          </Chip>
        ))}
      </div>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !entries ? (
        <LoadingState label="Loading the leaderboard" />
      ) : entries.length === 0 ? (
        <Card>
          <EmptyState icon="chart" title="No rankings yet" />
        </Card>
      ) : (
        <Card flush>
          <ol className="p-2 md:hidden">
            {entries.map((row) => (
              <li
                key={row.peer_mentor_id}
                aria-current={row.is_me ? 'true' : undefined}
                className={cx(
                  'grid grid-cols-[theme(spacing.8)_minmax(0,1fr)_auto] items-center gap-2.5 px-3 py-2.5 font-sans text-body text-text-primary',
                  row.is_me ? 'rounded-md bg-accent-bg' : 'border-b border-border last:border-b-0'
                )}
              >
                <span className="font-mono font-semibold tabular-nums text-text-secondary">
                  {row.rank}
                </span>
                <span className="min-w-0">
                  <Name row={row} />
                </span>
                <span className="font-mono font-semibold tabular-nums">
                  {rankedValue(row, rankedBy)}
                </span>
              </li>
            ))}
          </ol>
          <div className="hidden md:block">
            <Table label="Peer mentor leaderboard">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Rank</TableHeaderCell>
                  <TableHeaderCell>Peer mentor</TableHeaderCell>
                  {PEER_MENTOR_BOARDS.map((board) => (
                    <TableHeaderCell key={board.value} num>
                      {board.label}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((row) => (
                  <TableRow
                    key={row.peer_mentor_id}
                    highlight={row.is_me}
                    aria-current={row.is_me ? 'true' : undefined}
                  >
                    <TableCell className="font-mono tabular-nums">{row.rank}</TableCell>
                    <TableCell>
                      <Name row={row} />
                    </TableCell>
                    {PEER_MENTOR_BOARDS.map((board) => (
                      <TableCell key={board.value} num>
                        {rankedValue(row, board.value)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </>
  )
}
