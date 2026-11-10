import { TrackHeader } from '@/components/forge/TrackHeader'
import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { StatTile } from '@/components/ui/StatTile'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { formatDay, formatPercentage, formatTimeRange, plural } from '@/lib/format'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { MyTrackView } from '@/types/ictPeerMentor'

const NO_UNIVERSITY = 'University not available yet'

interface MyTrackScreenProps {
  // null while loading, and when no track is assigned yet
  data: MyTrackView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// An ICT peer mentor's track and the mentees on it. View only.
export function MyTrackScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: MyTrackScreenProps) {
  if (error || isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader title="My track" />
        {error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : (
          <LoadingState label="Loading your track" />
        )}
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader title="My track" />
        <Card className="md:max-w-2xl">
          <div className="flex flex-col items-center gap-4">
            <EmptyState icon="code" title="No track yet" />
            <ButtonLink href={MENTEE_ROUTES.sessions} variant="secondary">
              Go to my sessions
            </ButtonLink>
          </div>
        </Card>
      </div>
    )
  }

  const next = data.nextSession
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <TrackHeader
        title={data.track}
        subtitle={`${plural(data.menteeCount, 'mentee')} chose this track.`}
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
        <StatTile label="ICT session attendance" value={formatPercentage(data.attendanceRate)} />
        <StatTile label="ICT sessions so far" value={data.sessionsSoFar} />
        <div className="hidden md:block">
          <Card className="h-full">
            <div className="flex flex-col gap-1">
              <p className="font-sans text-small text-text-secondary">Next ICT session</p>
              {next ? (
                <>
                  <p className="font-sans text-body font-semibold text-text-primary">
                    {next.title}
                  </p>
                  <p className="font-sans text-small text-text-secondary">
                    {formatDay(next.startsAt)}, {formatTimeRange(next.startsAt, next.endsAt)}
                  </p>
                </>
              ) : (
                <p className="font-sans text-body text-text-muted">None scheduled</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {data.mentees.length === 0 ? (
        <Card>
          <EmptyState icon="users" title="No mentees yet" />
        </Card>
      ) : (
        <>
          <Card flush className="md:hidden">
            <ul className="px-4">
              {data.mentees.map((mentee) => (
                <li
                  key={mentee.id}
                  className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-small font-semibold text-text-primary">
                      {mentee.name}
                    </p>
                    <p className="font-sans text-caption text-text-muted">{NO_UNIVERSITY}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-small font-semibold text-text-primary">
                      {mentee.attendedLabel}
                    </p>
                    <p className="font-sans text-caption text-text-secondary">
                      {mentee.points} points
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card flush className="hidden md:block">
            <Table label="Mentees on your track">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Mentee</TableHeaderCell>
                  <TableHeaderCell>University</TableHeaderCell>
                  <TableHeaderCell num>ICT sessions attended</TableHeaderCell>
                  <TableHeaderCell num>ICT points</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.mentees.map((mentee) => (
                  <TableRow key={mentee.id}>
                    <TableCell className="font-semibold">{mentee.name}</TableCell>
                    <TableCell className="text-text-muted">Not available yet</TableCell>
                    <TableCell num>{mentee.attendedLabel}</TableCell>
                    <TableCell num>{mentee.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  )
}
