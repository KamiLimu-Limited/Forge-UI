import { TrackBadge } from '@/components/forge/TrackBadge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { plural } from '@/lib/format'
import type { TrackProgressRow } from '@/types/progress'

interface ProgressByTrackCardProps {
  rows: TrackProgressRow[]
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

function TrackName({ row }: { row: TrackProgressRow }) {
  if (!row.pillar) return <span className="font-sans text-small">{row.label}</span>
  return <TrackBadge pillar={row.pillar} label={row.label} />
}

// Attendance rate and points for each programme track. A list with bars on phones,
// a table from md up.
export function ProgressByTrackCard({
  rows,
  isLoading = false,
  error = null,
  onRetry,
}: ProgressByTrackCardProps) {
  return (
    <Card title="By track" flush>
      {isLoading ? (
        <LoadingState label="Loading progress by track" />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No sessions yet"
          description="Your progress by track shows up here once sessions have taken place."
        />
      ) : (
        <>
          <ul className="px-4 pb-2 md:hidden">
            {rows.map((row) => (
              <li key={row.label} className="border-b border-border py-2.5 last:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <TrackName row={row} />
                  <strong className="font-mono font-semibold tabular-nums text-text-primary">
                    {Math.round(row.rate)}%
                  </strong>
                </div>
                <ProgressBar
                  className="my-2"
                  value={row.rate}
                  label={`${row.label} attendance rate`}
                />
                <p className="font-sans text-caption text-text-secondary">
                  {row.attended} of {plural(row.scheduled, 'session')},{' '}
                  {plural(row.points, 'point')}
                </p>
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <Table label="Attendance by track">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Track</TableHeaderCell>
                  <TableHeaderCell num>Scheduled</TableHeaderCell>
                  <TableHeaderCell num>Attended</TableHeaderCell>
                  <TableHeaderCell num>Rate</TableHeaderCell>
                  <TableHeaderCell num>Points</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell>
                      <TrackName row={row} />
                    </TableCell>
                    <TableCell num>{row.scheduled}</TableCell>
                    <TableCell num>{row.attended}</TableCell>
                    <TableCell num>
                      <div className="flex items-center justify-end gap-3">
                        <ProgressBar
                          className="w-24"
                          value={row.rate}
                          label={`${row.label} attendance rate`}
                        />
                        <span className="w-12">{Math.round(row.rate)}%</span>
                      </div>
                    </TableCell>
                    <TableCell num>{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </Card>
  )
}
