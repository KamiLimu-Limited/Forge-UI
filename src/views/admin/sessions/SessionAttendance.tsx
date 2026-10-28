'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatusChip } from '@/components/forge/StatusChip'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { Textarea } from '@/components/ui/Textarea'
import { useSessionAttendance, type AttendanceRow } from '@/hooks/useSessionAttendance'
import { useToast } from '@/hooks/useToast'
import { formatDateTime, formatDay, formatTimeRange } from '@/lib/format'
import type { AttendanceStatus } from '@/types/attendance'
import type { SessionDetailResponse } from '@/types/session'

const FIRST_ROWS = 10

function detailFor(row: AttendanceRow): string {
  if (row.pendingRequest) return 'Extension requested'
  const submitted = row.record.submitted_at ? formatDateTime(row.record.submitted_at) : null
  switch (row.record.status) {
    case 'attended':
      return submitted ? `Submitted ${submitted}` : 'Present'
    case 'not_attended':
      return 'Submitted as absent'
    case 'missed':
      return 'Window closed'
    case 'excused':
      return 'Excused by an admin'
    case 'pending':
      return 'Not submitted yet'
    case 'disputed':
      return 'Under review'
  }
}

const EXPLANATIONS: Record<AttendanceStatus, string> = {
  attended: 'Submitted as present. This counts towards their attendance rate.',
  not_attended: 'They submitted that they did not attend. Absent counts against every rate.',
  missed: 'The window closed without a submission. Missed counts as absent in every rate.',
  excused: "This absence is excused, so it doesn't count against them.",
  pending: "The window is open and they haven't submitted yet.",
  disputed: 'This record is under review.',
}

function headerSubtitle(session: SessionDetailResponse, present: number, total: number): string {
  const parts = [
    `${formatDay(session.starts_at)}, ${formatTimeRange(session.starts_at, session.ends_at)}.`,
  ]
  const window = session.attendance_window
  if (window) {
    parts.push(
      window.is_active
        ? `The window closes ${formatDateTime(window.closes_at)}.`
        : `The window closed ${formatDateTime(window.closes_at)}.`
    )
  } else if (session.status !== 'cancelled') {
    parts.push('The attendance window opens when the session is published and starts.')
  }
  if (total > 0) parts.push(`${present} of ${total} present.`)
  return parts.join(' ')
}

interface RecordPanelProps {
  row: AttendanceRow
  isSaving: boolean
  error: string | null
  onExcuse: (reason: string) => void
}

function RecordPanel({ row, isSaving, error, onExcuse }: RecordPanelProps) {
  const [reason, setReason] = useState('')
  const [missing, setMissing] = useState(false)
  const canExcuse = row.record.status !== 'excused' && row.record.status !== 'attended'

  useEffect(() => {
    setReason('')
    setMissing(false)
  }, [row.record.id])

  const explanation =
    EXPLANATIONS[row.record.status] +
    (row.record.status === 'missed' && !row.pendingRequest
      ? " They didn't ask for an extension."
      : '')

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-mono text-card-title font-semibold text-text-primary">{row.name}</h2>
          <StatusChip kind="attendance" status={row.record.status} />
        </div>
        <p className="font-sans text-small text-text-secondary">{explanation}</p>
        {row.pendingRequest && (
          <Notice variant="info">
            They asked for an extension: &ldquo;{row.pendingRequest.reason}&rdquo;{' '}
            <Link href="/admin/attendance-queue" className="font-semibold text-link underline">
              Review request
            </Link>
          </Notice>
        )}
        {row.record.feedback && (
          <p className="font-sans text-small text-text-secondary">
            Feedback: &ldquo;{row.record.feedback}&rdquo;
          </p>
        )}
        {canExcuse && (
          <>
            <hr className="border-border" />
            <h3 className="font-mono text-body font-semibold text-text-primary">Mark as excused</h3>
            <p className="font-sans text-small text-text-secondary">
              Excused sessions don&apos;t count against the participant. The change is recorded in
              the audit trail.
            </p>
            <Textarea
              label="Reason"
              placeholder="Why this absence is excused"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setMissing(false)
              }}
              error={missing ? 'Add a reason before you excuse this record.' : (error ?? undefined)}
            />
            <Button
              className="self-start"
              isLoading={isSaving}
              onClick={() => {
                if (!reason.trim()) {
                  setMissing(true)
                  return
                }
                onExcuse(reason.trim())
              }}
            >
              Mark as excused
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}

interface SessionAttendancePageProps {
  sessionId: string
}

export function SessionAttendancePage({ sessionId }: SessionAttendancePageProps) {
  const { showToast } = useToast()
  const data = useSessionAttendance(sessionId)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  // Start on the first record that might need attention
  useEffect(() => {
    if (selectedId || data.rows.length === 0) return
    const first = data.rows.find((r) => r.record.status !== 'attended') ?? data.rows[0]
    setSelectedId(first.record.id)
  }, [data.rows, selectedId])

  const selected = data.rows.find((r) => r.record.id === selectedId) ?? null
  const visible = showAll ? data.rows : data.rows.slice(0, FIRST_ROWS)

  const excuse = async (reason: string) => {
    if (!selected) return
    if (await data.excuse(selected.record.id, reason)) {
      showToast(`${selected.name} is now excused for this session.`)
    }
  }

  const back = <BackLink href="/admin/sessions">Back to the calendar</BackLink>

  if (data.isLoading && !data.session) {
    return (
      <>
        {back}
        <LoadingState label="Loading attendance" />
      </>
    )
  }

  if (data.error || !data.session) {
    return (
      <>
        {back}
        <ErrorState
          message={data.error ?? "We couldn't find this session."}
          onRetry={data.refetch}
        />
      </>
    )
  }

  const session = data.session

  return (
    <>
      {back}
      <PageHeader
        title={session.title}
        subtitle={headerSubtitle(session, data.presentCount, data.rows.length)}
      />
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card flush>
            {data.isLoading ? (
              <LoadingState label="Loading attendance" />
            ) : data.rows.length === 0 ? (
              <EmptyState
                title="No attendance records yet"
                description="Records appear once the attendance window opens and participants submit, or when the window closes."
              />
            ) : (
              <>
                <Table label={`Attendance for ${session.title}`}>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Participant</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Detail</TableHeaderCell>
                      <TableHeaderCell>
                        <span className="sr-only">Actions</span>
                      </TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visible.map((row) => (
                      <TableRow key={row.record.id} highlight={row.record.id === selectedId}>
                        <TableCell className="font-semibold">{row.name}</TableCell>
                        <TableCell>
                          <StatusChip kind="attendance" status={row.record.status} />
                        </TableCell>
                        <TableCell className="text-text-secondary">{detailFor(row)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedId(row.record.id)
                              data.clearExcuseError()
                            }}
                            aria-label={`Open ${row.name}`}
                          >
                            Open
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {data.rows.length > FIRST_ROWS && (
                  <div className="px-4 py-2 md:px-6">
                    <Button variant="secondary" size="sm" onClick={() => setShowAll((v) => !v)}>
                      {showAll ? 'Show fewer' : `Show all ${data.rows.length}`}
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
        <div className="lg:col-span-2">
          {selected && (
            <RecordPanel
              row={selected}
              isSaving={data.isExcusing}
              error={data.excuseError}
              onExcuse={(reason) => void excuse(reason)}
            />
          )}
        </div>
      </div>
    </>
  )
}
