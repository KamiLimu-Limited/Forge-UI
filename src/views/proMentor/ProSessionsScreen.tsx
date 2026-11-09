import { TrackBadge } from '@/components/forge/TrackBadge'
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
import { TextLink } from '@/components/ui/TextLink'
import { formatDateTime, formatDay } from '@/lib/format'
import { proFeedbackRoute, proResourcesRoute } from '@/lib/proMentorRoutes'
import type { ProSessionRow, ProSessionsView } from '@/types/proMentor'

interface ProSessionsScreenProps {
  // null until the data loads
  data: ProSessionsView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

const ROLE_LABELS = { lead: 'Lead', co_mentor: 'Co-mentor' } as const

function roleLabel(row: ProSessionRow): string {
  return row.role ? ROLE_LABELS[row.role] : 'Mentor'
}

function attendedLine(row: ProSessionRow): string {
  return `${row.attended} of ${row.eligible}`
}

function ratingLine(row: ProSessionRow): string {
  return row.rating === null ? 'No ratings' : row.rating.toFixed(1)
}

function Upcoming({ rows }: { rows: ProSessionRow[] }) {
  if (rows.length === 0) {
    return <p className="font-sans text-small text-text-muted">No upcoming sessions</p>
  }
  return (
    <>
      <ul className="flex flex-col md:hidden">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0"
          >
            <p className="font-sans text-body font-semibold text-text-primary">{row.title}</p>
            <p className="font-sans text-small text-text-secondary">
              {formatDateTime(row.startsAt)}. {roleLabel(row)}.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {row.pillar && <TrackBadge pillar={row.pillar} />}
              <TextLink href={proResourcesRoute(row.id)}>Update materials</TextLink>
            </div>
          </li>
        ))}
      </ul>
      <div className="hidden md:block">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Session</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Your role</TableHeaderCell>
              <TableHeaderCell>Track</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>
                <span className="sr-only">Materials</span>
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-semibold">{row.title}</TableCell>
                <TableCell>{formatDateTime(row.startsAt)}</TableCell>
                <TableCell>{roleLabel(row)}</TableCell>
                <TableCell>{row.pillar ? <TrackBadge pillar={row.pillar} /> : null}</TableCell>
                <TableCell>{row.statusLabel && <Chip>{row.statusLabel}</Chip>}</TableCell>
                <TableCell>
                  <TextLink href={proResourcesRoute(row.id)}>Update materials</TextLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

function Past({ rows }: { rows: ProSessionRow[] }) {
  if (rows.length === 0) {
    return <p className="font-sans text-small text-text-muted">No past sessions yet</p>
  }
  return (
    <>
      <ul className="flex flex-col md:hidden">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0"
          >
            <p className="font-sans text-body font-semibold text-text-primary">{row.title}</p>
            <p className="font-sans text-small text-text-secondary">
              {formatDay(row.startsAt)}. {roleLabel(row)}. {attendedLine(row)} attended
              {row.rating === null ? '.' : `, rated ${ratingLine(row)}.`}
            </p>
            <TextLink href={proFeedbackRoute(row.id)}>View feedback</TextLink>
          </li>
        ))}
      </ul>
      <div className="hidden md:block">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Session</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Your role</TableHeaderCell>
              <TableHeaderCell num>Attended</TableHeaderCell>
              <TableHeaderCell num>Average rating</TableHeaderCell>
              <TableHeaderCell>
                <span className="sr-only">Feedback</span>
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-semibold">{row.title}</TableCell>
                <TableCell>{formatDay(row.startsAt)}</TableCell>
                <TableCell>{roleLabel(row)}</TableCell>
                <TableCell num>{attendedLine(row)}</TableCell>
                <TableCell num>{ratingLine(row)}</TableCell>
                <TableCell>
                  <TextLink href={proFeedbackRoute(row.id)}>View feedback</TextLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

// The sessions a professional mentor leads or co-leads, upcoming and past. This only
// draws the screen; the page's hook loads the data.
export function ProSessionsScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: ProSessionsScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="My sessions"
        subtitle={
          data?.cohortName ? `Sessions you lead or co-lead in ${data.cohortName}.` : undefined
        }
      />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading your sessions" />
      ) : data.upcoming.length === 0 && data.past.length === 0 ? (
        <Card>
          <EmptyState
            icon="calendar"
            title="No sessions yet"
            description="Sessions show here once the System Admin assigns you to one."
          />
        </Card>
      ) : (
        <>
          <Card title="Upcoming">
            <Upcoming rows={data.upcoming} />
          </Card>
          <Card title="Past">
            <Past rows={data.past} />
          </Card>
        </>
      )}
    </div>
  )
}
