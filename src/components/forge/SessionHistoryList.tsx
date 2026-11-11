import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { cx } from '@/lib/cx'
import { formatDay } from '@/lib/format'
import type { HistoryRow } from '@/types/menteeSessions'
import { AttendanceStateChip } from './AttendanceStateChip'
import { SessionHistoryDetail } from './SessionHistoryDetail'
import { TrackBadge } from './TrackBadge'

interface SessionHistoryListProps {
  rows: HistoryRow[]
  selectedId: string | null
  onSelect: (sessionId: string) => void
}

// Below lg the detail opens under the chosen row, so nobody scrolls past a long list
// to read it. From lg it sits in the side panel and this is a table.
export function SessionHistoryList({ rows, selectedId, onSelect }: SessionHistoryListProps) {
  return (
    <Card flush>
      <ul className="px-4 lg:hidden">
        {rows.map((row) => {
          const isOpen = row.sessionId === selectedId
          return (
            <li key={row.sessionId} className="border-b border-border last:border-b-0">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => onSelect(row.sessionId)}
                className="flex min-h-control w-full items-start justify-between gap-3 py-3 text-left"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-sans text-body font-semibold text-text-primary">
                    {row.title}
                  </span>
                  <span className="font-sans text-small text-text-secondary">
                    {formatDay(row.startsAt)}
                  </span>
                  {row.pillar && (
                    <span>
                      <TrackBadge pillar={row.pillar} />
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-text-muted">
                  <AttendanceStateChip state={row.state} isReopened={row.isReopened} />
                  <Icon
                    name="chevron-down"
                    className={cx('size-4 transition-transform', isOpen && 'rotate-180')}
                  />
                </span>
              </button>
              {isOpen && (
                <div className="pb-4">
                  <SessionHistoryDetail row={row} />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="hidden lg:block">
        <Table label="Session history">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Session</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Track</TableHeaderCell>
              <TableHeaderCell>Attendance</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.sessionId} highlight={row.sessionId === selectedId}>
                <TableCell>
                  <button
                    type="button"
                    aria-pressed={row.sessionId === selectedId}
                    onClick={() => onSelect(row.sessionId)}
                    className="relative text-left font-semibold text-text-primary before:absolute before:inset-x-0 before:-inset-y-3 before:content-[''] hover:underline"
                  >
                    {row.title}
                  </button>
                </TableCell>
                <TableCell className="whitespace-nowrap">{formatDay(row.startsAt)}</TableCell>
                <TableCell>{row.pillar && <TrackBadge pillar={row.pillar} />}</TableCell>
                <TableCell>
                  <AttendanceStateChip state={row.state} isReopened={row.isReopened} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
