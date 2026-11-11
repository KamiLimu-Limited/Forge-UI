import { AttendanceStateChip } from '@/components/forge/AttendanceStateChip'
import { TrackBadge } from '@/components/forge/TrackBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { formatDay } from '@/lib/format'
import type { AlumniRecordTab, AlumniRecordView, AlumniSessionRow } from '@/types/alumni'
import type { MenteeActivityCount, MenteeObjectiveRow } from '@/types/peerMentor'

const TABS: { value: AlumniRecordTab; label: string }[] = [
  { value: 'sessions', label: 'Sessions' },
  { value: 'activities', label: 'Activities' },
  { value: 'objectives', label: 'Objectives' },
]

interface AlumniHistoryScreenProps {
  // null until the data loads
  data: AlumniRecordView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  tab: AlumniRecordTab
  onTabChange: (tab: AlumniRecordTab) => void
}

function Muted({ children }: { children: string }) {
  return <p className="font-sans text-small text-text-muted">{children}</p>
}

function Sessions({ rows }: { rows: AlumniSessionRow[] | null }) {
  if (rows === null) {
    return (
      <Card>
        <Muted>Not available yet.</Muted>
      </Card>
    )
  }
  if (rows.length === 0) {
    return (
      <Card>
        <Muted>No sessions on record.</Muted>
      </Card>
    )
  }
  return (
    <>
      <Card flush className="md:hidden">
        <ul className="px-4">
          {rows.map((row) => (
            <li
              key={row.sessionId}
              className="flex items-start justify-between gap-3 border-b border-border py-3 last:border-b-0"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-sans text-small font-semibold text-text-primary">{row.title}</p>
                <p className="font-sans text-caption text-text-secondary">
                  {formatDay(row.startsAt)}
                </p>
                {row.pillar && (
                  <span>
                    <TrackBadge pillar={row.pillar} />
                  </span>
                )}
              </div>
              <AttendanceStateChip state={row.state} />
            </li>
          ))}
        </ul>
      </Card>
      <Card flush className="hidden md:block">
        <Table label="Sessions and attendance">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Session</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Pillar</TableHeaderCell>
              <TableHeaderCell>Attendance</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.sessionId}>
                <TableCell className="font-semibold">{row.title}</TableCell>
                <TableCell>{formatDay(row.startsAt)}</TableCell>
                <TableCell>{row.pillar ? <TrackBadge pillar={row.pillar} /> : null}</TableCell>
                <TableCell>
                  <AttendanceStateChip state={row.state} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}

function Activities({ counts }: { counts: MenteeActivityCount[] | null }) {
  return (
    <Card title="Extra activities">
      {counts === null ? (
        <Muted>Not available yet.</Muted>
      ) : (
        <ul>
          {counts.map((item) => (
            <li
              key={item.label}
              className="flex justify-between gap-3 border-b border-border py-3 font-sans text-body last:border-b-0"
            >
              <span className="text-text-primary">{item.label}</span>
              <span className="font-mono font-semibold text-text-primary">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function Objectives({ rows }: { rows: MenteeObjectiveRow[] | null }) {
  return (
    <Card title="Objectives">
      {rows === null ? (
        <Muted>Not available yet.</Muted>
      ) : rows.length === 0 ? (
        <Muted>No objectives on record.</Muted>
      ) : (
        <ul>
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-0.5 border-b border-border py-3 last:border-b-0 md:flex-row md:justify-between md:gap-4"
            >
              <span className="font-sans text-body text-text-primary">{row.label}</span>
              <span className="font-sans text-small text-text-secondary">{row.summary}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// An alumnus's past cohort record, read only.
export function AlumniHistoryScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  tab,
  onTabChange,
}: AlumniHistoryScreenProps) {
  if (error || isLoading || !data) {
    return (
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader title="Your record" subtitle="Read only" />
        {error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : (
          <LoadingState label="Loading your record" />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader title={`${data.cohortName} record`} subtitle="Read only" />
      <SegmentedControl
        label="Choose part of your record"
        options={TABS}
        value={tab}
        onChange={onTabChange}
      />
      {tab === 'sessions' && (
        <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <Sessions rows={data.sessions} />
          </div>
          <Activities counts={data.activities} />
        </div>
      )}
      {tab === 'activities' && <Activities counts={data.activities} />}
      {tab === 'objectives' && <Objectives rows={data.objectives} />}
    </div>
  )
}
