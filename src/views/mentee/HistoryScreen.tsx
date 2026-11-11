'use client'

import { SessionHistoryDetail } from '@/components/forge/SessionHistoryDetail'
import { SessionHistoryList } from '@/components/forge/SessionHistoryList'
import { AttendanceStateChip } from '@/components/forge/AttendanceStateChip'
import { SessionViewTabs } from '@/components/forge/SessionViewTabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Select } from '@/components/ui/Select'
import { useHistoryFilters } from '@/hooks/useHistoryFilters'
import type { HistoryFilters, MenteeHistoryData } from '@/types/menteeSessions'

const FILTER_LABELS: Record<keyof HistoryFilters, string> = {
  month: 'Filter by month',
  track: 'Filter by track',
  state: 'Filter by attendance',
  type: 'Filter by session type',
}

const FILTER_NAMES = Object.keys(FILTER_LABELS) as Array<keyof HistoryFilters>

interface HistoryScreenProps {
  // null until the data loads
  data: MenteeHistoryData | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// Session history with filters. Single column below lg, list and detail side by side from
// lg.
export function HistoryScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: HistoryScreenProps) {
  const rows = data?.rows ?? []
  const { filters, setFilter, options, visibleRows, selected, select } = useHistoryFilters(rows)

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Sessions"
        subtitle={
          data?.monthLine ? <span className="hidden md:inline">{data.monthLine}</span> : undefined
        }
      />
      <SessionViewTabs />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading your session history" />
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState icon="calendar" title="No sessions yet" />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {FILTER_NAMES.map((name) => (
              <Select
                key={name}
                aria-label={FILTER_LABELS[name]}
                options={options[name]}
                value={filters[name]}
                onChange={(event) => setFilter(name, event.target.value)}
              />
            ))}
          </div>
          {visibleRows.length === 0 ? (
            <Card>
              <EmptyState
                icon="search"
                title="No sessions match"
                description="Try changing or clearing a filter."
              />
            </Card>
          ) : (
            <div className="grid items-start gap-5 lg:grid-cols-5">
              <div className="min-w-0 lg:col-span-3">
                <SessionHistoryList
                  rows={visibleRows}
                  selectedId={selected?.sessionId ?? null}
                  onSelect={select}
                />
              </div>
              {selected && (
                <div className="hidden min-w-0 lg:col-span-2 lg:block">
                  <Card
                    title={selected.title}
                    action={<AttendanceStateChip state={selected.state} />}
                  >
                    <SessionHistoryDetail row={selected} />
                  </Card>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
