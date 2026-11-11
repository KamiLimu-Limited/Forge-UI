import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { TextLink } from '@/components/ui/TextLink'
import { formatLongDate, plural } from '@/lib/format'
import { menteeApplicationUpdateRoute } from '@/lib/menteeRoutes'
import type { ActivityLogRow } from '@/types/menteeActivities'

interface RecentActivityListProps {
  rows: ActivityLogRow[]
}

// A reversed log keeps its row, so the mentee can see why their points changed
function ReversedChip({ row }: { row: ActivityLogRow }) {
  return row.status === 'reversed' ? <Chip>Reversed</Chip> : null
}

export function RecentActivityList({ rows }: RecentActivityListProps) {
  return (
    <Card title="Your recent logs" flush>
      {rows.length === 0 ? (
        <EmptyState icon="star" title="Nothing logged yet" />
      ) : (
        <>
          <ul className="px-4 pb-2 md:hidden">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="font-sans text-body font-semibold text-text-primary">
                    {row.typeLabel}
                  </p>
                  <p className="font-sans text-small text-text-secondary">
                    {row.details}, {plural(row.points, 'point')}
                  </p>
                  <ReversedChip row={row} />
                </div>
                {row.canUpdate && (
                  <TextLink href={menteeApplicationUpdateRoute(row.id)}>Update</TextLink>
                )}
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <Table label="Your recent logs">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Details</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell num>Points</TableHeaderCell>
                  <TableHeaderCell>
                    <span className="sr-only">Actions</span>
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.typeLabel}</TableCell>
                    <TableCell>{row.details}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatLongDate(row.date)}</TableCell>
                    <TableCell num>{row.points}</TableCell>
                    <TableCell>
                      {row.canUpdate ? (
                        <TextLink href={menteeApplicationUpdateRoute(row.id)} layout="inline">
                          Update stage
                        </TextLink>
                      ) : (
                        <ReversedChip row={row} />
                      )}
                    </TableCell>
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
