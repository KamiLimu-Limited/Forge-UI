import { TrackHeader } from '@/components/forge/TrackHeader'
import { PageHeader } from '@/components/layout/PageHeader'
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
import { formatDay, formatTimeRange } from '@/lib/format'
import type { TrackSessionRow, TrackSessionsView } from '@/types/ictPeerMentor'

interface TrackSessionsScreenProps {
  // null while loading, and when no track is assigned yet
  data: TrackSessionsView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

function Attended({ row }: { row: TrackSessionRow }) {
  if (row.isToday) return <Chip>Today</Chip>
  return <>{row.attendedLabel ?? 'Not known yet'}</>
}

function Materials({ row, label }: { row: TrackSessionRow; label: string }) {
  if (!row.materialsUrl) return <span className="text-text-muted">None yet</span>
  return (
    <a
      href={row.materialsUrl}
      target="_blank"
      rel="noreferrer"
      className="relative before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] text-link"
    >
      {label}
    </a>
  )
}

// The ICT sessions on an ICT peer mentor's track, with how many of their mentees attended.
export function TrackSessionsScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: TrackSessionsScreenProps) {
  if (error || isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader title="ICT sessions" />
        {error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : (
          <LoadingState label="Loading your track's sessions" />
        )}
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader title="ICT sessions" />
        <Card>
          <EmptyState icon="calendar" title="No track yet" />
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <TrackHeader title={`${data.track} sessions`} />
      {data.sessions.length === 0 ? (
        <Card>
          <EmptyState icon="calendar" title="No ICT sessions yet" />
        </Card>
      ) : (
        <>
          <Card flush className="md:hidden">
            <ul className="px-4">
              {data.sessions.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-0.5 border-b border-border py-3 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 font-sans text-small font-semibold text-text-primary">
                      {row.title}
                    </p>
                    <span className="shrink-0 font-mono text-caption font-semibold text-text-primary">
                      {row.isToday ? (
                        <Chip>Today</Chip>
                      ) : (
                        row.attendedLabel && `${row.attendedLabel} attended`
                      )}
                    </span>
                  </div>
                  <p className="font-sans text-caption text-text-secondary">
                    {formatDay(row.startsAt)}, {formatTimeRange(row.startsAt, row.endsAt)}
                  </p>
                  <span className="font-sans text-caption">
                    <Materials row={row} label="Materials" />
                  </span>
                </li>
              ))}
            </ul>
          </Card>
          <Card flush className="hidden md:block">
            <Table label="Sessions on your track">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Session</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell num>Attended</TableHeaderCell>
                  <TableHeaderCell>Materials</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.sessions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-semibold">{row.title}</TableCell>
                    <TableCell>
                      {formatDay(row.startsAt)}, {formatTimeRange(row.startsAt, row.endsAt)}
                    </TableCell>
                    <TableCell num>
                      <Attended row={row} />
                    </TableCell>
                    <TableCell>
                      <Materials row={row} label="Open" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
      {data.next && (
        <p className="font-sans text-small text-text-muted">
          Coming up: {data.next.title}, {formatDay(data.next.startsAt)}.
        </p>
      )}
    </div>
  )
}
