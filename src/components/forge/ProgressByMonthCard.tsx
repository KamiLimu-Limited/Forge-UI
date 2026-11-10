import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
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
import type { MonthProgressRow } from '@/types/progress'

interface ProgressByMonthCardProps {
  rows: MonthProgressRow[]
  title?: string
  // Right side of the header, such as a link to the full breakdown
  action?: ReactNode
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// Attendance for each KamiLimu month. A list on phones, a table from md up.
export function ProgressByMonthCard({
  rows,
  title = 'By KamiLimu month',
  action,
  isLoading = false,
  error = null,
  onRetry,
}: ProgressByMonthCardProps) {
  return (
    <Card title={title} action={action} flush>
      {isLoading ? (
        <LoadingState label="Loading progress by month" />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : rows.length === 0 ? (
        <EmptyState icon="calendar" title="No sessions yet" />
      ) : (
        <>
          <ul className="px-4 pb-2 md:hidden">
            {rows.map((row) => (
              <li
                key={row.label}
                className="flex justify-between gap-3 border-b border-border py-2.5 font-sans text-small text-text-primary last:border-b-0"
              >
                <span>{row.label}</span>
                <span className="font-mono tabular-nums">
                  {row.attended} of {row.scheduled},{' '}
                  <strong className="font-semibold">{Math.round(row.rate)}%</strong>
                </span>
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <Table label="Attendance by KamiLimu month">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Month</TableHeaderCell>
                  <TableHeaderCell num>Scheduled</TableHeaderCell>
                  <TableHeaderCell num>Attended</TableHeaderCell>
                  <TableHeaderCell num>Rate</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell num>{row.scheduled}</TableCell>
                    <TableCell num>{row.attended}</TableCell>
                    <TableCell num>{Math.round(row.rate)}%</TableCell>
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
