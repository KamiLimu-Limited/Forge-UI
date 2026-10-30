'use client'

import { useMemo, useState } from 'react'
import type { SelectOption } from '@/components/ui/Select'
import { ATTENDANCE_STATUS_LABELS, SESSION_TYPE_LABELS } from '@/lib/labels'
import { ALL_FILTERS, filterHistory } from '@/lib/menteeSessions'
import type { HistoryFilters, HistoryRow } from '@/types/menteeSessions'

export interface HistoryFilterOptions {
  month: SelectOption[]
  track: SelectOption[]
  state: SelectOption[]
  type: SelectOption[]
}

interface UseHistoryFiltersReturn {
  filters: HistoryFilters
  setFilter: (name: keyof HistoryFilters, value: string) => void
  options: HistoryFilterOptions
  visibleRows: HistoryRow[]
  selected: HistoryRow | null
  select: (sessionId: string) => void
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values))
}

// Each filter only offers values the mentee's history actually has
function buildOptions(rows: HistoryRow[]): HistoryFilterOptions {
  const months = unique(rows.map((row) => row.month)).sort((a, b) => a - b)
  return {
    month: [
      { value: '', label: 'All months' },
      ...months.map((month) => ({ value: String(month), label: `Month ${month}` })),
    ],
    track: [
      { value: '', label: 'All tracks' },
      ...unique(rows.flatMap((row) => (row.track ? [row.track] : []))).map((track) => ({
        value: track,
        label: track,
      })),
    ],
    state: [
      { value: '', label: 'All states' },
      ...unique(rows.map((row) => row.state)).map((state) => ({
        value: state,
        label: ATTENDANCE_STATUS_LABELS[state],
      })),
    ],
    type: [
      { value: '', label: 'All types' },
      ...unique(rows.map((row) => row.sessionType)).map((type) => ({
        value: type,
        label: SESSION_TYPE_LABELS[type],
      })),
    ],
  }
}

// Filters the history and tracks the open session. If a filter hides the open
// session, the first visible one takes its place.
export function useHistoryFilters(rows: HistoryRow[]): UseHistoryFiltersReturn {
  const [filters, setFilters] = useState<HistoryFilters>(ALL_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const options = useMemo(() => buildOptions(rows), [rows])
  const visibleRows = useMemo(() => filterHistory(rows, filters), [rows, filters])

  return {
    filters,
    setFilter: (name, value) => setFilters((current) => ({ ...current, [name]: value })),
    options,
    visibleRows,
    selected: visibleRows.find((row) => row.sessionId === selectedId) ?? visibleRows[0] ?? null,
    select: setSelectedId,
  }
}
