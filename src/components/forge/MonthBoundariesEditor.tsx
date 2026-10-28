'use client'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import type { MonthRow } from '@/hooks/useCohortForm'

interface MonthBoundariesEditorProps {
  months: MonthRow[]
  onChange: (key: string, patch: Partial<MonthRow>) => void
  onRemove: (key: string) => void
  error?: string
  disabled?: boolean
}

const dateInput =
  'h-control w-full min-w-36 rounded-control border border-border-strong bg-surface px-3 font-sans text-body text-text-primary disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text'

// The KamiLimu months table: a label, start and end date for each month
export function MonthBoundariesEditor({
  months,
  onChange,
  onRemove,
  error,
  disabled = false,
}: MonthBoundariesEditorProps) {
  return (
    <div className="flex flex-col gap-2">
      {months.length === 0 ? (
        <p className="px-4 pb-4 font-sans text-small text-text-secondary md:px-6">
          No months yet. Add one to set where each KamiLimu month starts and ends.
        </p>
      ) : (
        <Table label="KamiLimu months">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Month</TableHeaderCell>
              <TableHeaderCell>Starts</TableHeaderCell>
              <TableHeaderCell>Ends</TableHeaderCell>
              <TableHeaderCell>
                <span className="sr-only">Remove</span>
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((row) => {
              const label = row.name || `Month ${row.month}`
              return (
                <TableRow key={row.key}>
                  <TableCell className="whitespace-nowrap">{label}</TableCell>
                  <TableCell>
                    <input
                      type="date"
                      aria-label={`${label} starts`}
                      value={row.start}
                      onChange={(e) => onChange(row.key, { start: e.target.value })}
                      disabled={disabled}
                      className={dateInput}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="date"
                      aria-label={`${label} ends`}
                      value={row.end}
                      onChange={(e) => onChange(row.key, { end: e.target.value })}
                      disabled={disabled}
                      className={dateInput}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onRemove(row.key)}
                      disabled={disabled}
                      aria-label={`Remove ${label}`}
                    >
                      <Icon name="close" className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
      {error && (
        <p role="alert" className="px-4 pb-4 font-sans text-caption text-danger-text md:px-6">
          {error}
        </p>
      )}
    </div>
  )
}
