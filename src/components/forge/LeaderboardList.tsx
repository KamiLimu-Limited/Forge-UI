'use client'

import { Fragment, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { cx } from '@/lib/cx'
import {
  formatBoardValue,
  leaderboardRowKey,
  leaderboardSlice,
  valueHeading,
} from '@/lib/leaderboard'
import type { DimensionEntry, LeaderboardDimension } from '@/types/leaderboard'

interface LeaderboardListProps {
  dimension: LeaderboardDimension
  entries: DimensionEntry[]
}

function Name({ entry }: { entry: DimensionEntry }) {
  if (!entry.is_me) return <>{entry.display_name}</>
  return (
    <>
      <strong className="font-semibold">{entry.display_name}</strong> (you)
    </>
  )
}

// One board. Long boards show the top and the mentee's own place until opened in full.
// A list on phones, a table from md up.
export function LeaderboardList({ dimension, entries }: LeaderboardListProps) {
  const [showAll, setShowAll] = useState(false)
  const { rows, gapAfter } = leaderboardSlice(entries, showAll)
  const isShortened = rows.length < entries.length

  if (entries.length === 0) {
    return (
      <Card>
        <EmptyState icon="chart" title="No rankings yet" />
      </Card>
    )
  }

  return (
    <Card flush>
      <ol className="p-2 md:hidden">
        {rows.map((entry) => {
          const key = leaderboardRowKey(entry)
          return (
            <Fragment key={key}>
              <li
                aria-current={entry.is_me ? 'true' : undefined}
                className={cx(
                  'grid grid-cols-[theme(spacing.8)_minmax(0,1fr)_auto] items-center gap-2.5 px-3 py-2.5 font-sans text-body text-text-primary',
                  entry.is_me ? 'rounded-md bg-accent-bg' : 'border-b border-border last:border-b-0'
                )}
              >
                <span className="font-mono font-semibold tabular-nums text-text-secondary">
                  {entry.rank}
                </span>
                <span className="min-w-0">
                  <Name entry={entry} />
                </span>
                <span className="font-mono font-semibold tabular-nums">
                  {formatBoardValue(dimension, entry.value)}
                </span>
              </li>
              {key === gapAfter && (
                <li aria-hidden="true" className="py-1.5 text-center text-caption text-text-muted">
                  ...
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>

      <div className="hidden md:block">
        <Table label="Leaderboard">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Rank</TableHeaderCell>
              <TableHeaderCell>Mentee</TableHeaderCell>
              <TableHeaderCell>University</TableHeaderCell>
              <TableHeaderCell num>{valueHeading(dimension)}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((entry) => {
              const key = leaderboardRowKey(entry)
              return (
                <Fragment key={key}>
                  <TableRow highlight={entry.is_me} aria-current={entry.is_me ? 'true' : undefined}>
                    <TableCell className="font-mono tabular-nums">{entry.rank}</TableCell>
                    <TableCell>
                      <Name entry={entry} />
                    </TableCell>
                    <TableCell className="text-text-muted">Not available yet</TableCell>
                    <TableCell num>{formatBoardValue(dimension, entry.value)}</TableCell>
                  </TableRow>
                  {key === gapAfter && (
                    <TableRow aria-hidden="true">
                      <TableCell colSpan={4} className="text-center text-text-muted">
                        ...
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {isShortened && (
        <div className="px-4 pb-2 md:px-6">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex min-h-control items-center font-sans text-caption font-semibold text-link hover:underline"
          >
            See the full list of {entries.length}
          </button>
        </div>
      )}
    </Card>
  )
}
