'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { toDateOnly } from '@/lib/format'
import type { CohortResponse } from '@/types/cohort'
import { useActiveCohort } from './useActiveCohort'
import { useAsyncAction } from './useAsyncAction'

interface UseTrackSelectionWindowReturn {
  // YYYY-MM-DD, '' when not set
  opens: string
  closes: string
  setOpens: (value: string) => void
  setCloses: (value: string) => void
  isOpen: boolean
  isDirty: boolean
  // An error to show before saving, such as a closing date before the opening date
  invalid: string | null
  save: () => Promise<boolean>
  isSaving: boolean
  error: string | null
}

function isOpenNow(cohort: CohortResponse | null, now: Date = new Date()): boolean {
  if (!cohort?.track_selection_opens_at || !cohort.track_selection_closes_at) return false
  return (
    new Date(cohort.track_selection_opens_at) <= now &&
    now <= new Date(cohort.track_selection_closes_at)
  )
}

// When mentees can choose an ICT track. The window opens at the start of its first day and
// closes at the end of its last, local time.
export function useTrackSelectionWindow(): UseTrackSelectionWindowReturn {
  const active = useActiveCohort()
  const cohort = active.cohort
  const savedOpens = cohort?.track_selection_opens_at
    ? toDateOnly(cohort.track_selection_opens_at)
    : ''
  const savedCloses = cohort?.track_selection_closes_at
    ? toDateOnly(cohort.track_selection_closes_at)
    : ''
  const [opens, setOpens] = useState(savedOpens)
  const [closes, setCloses] = useState(savedCloses)

  useEffect(() => {
    setOpens(savedOpens)
    setCloses(savedCloses)
  }, [savedOpens, savedCloses])

  const invalid =
    Boolean(opens) !== Boolean(closes)
      ? 'Choose both an opening and a closing date.'
      : opens && closes && closes < opens
        ? 'The closing date must be on or after the opening date.'
        : null

  const send = useCallback(
    () =>
      api.cohorts.setTrackSelectionWindow(cohort?.id as string, {
        opens_at: opens ? new Date(`${opens}T00:00:00`).toISOString() : null,
        closes_at: closes ? new Date(`${closes}T23:59:59`).toISOString() : null,
      }),
    [cohort?.id, opens, closes]
  )
  const action = useAsyncAction(send, "The selection window didn't save. Try again.")

  return {
    opens,
    closes,
    setOpens,
    setCloses,
    isOpen: isOpenNow(cohort),
    isDirty: opens !== savedOpens || closes !== savedCloses,
    invalid,
    save: async () => {
      if (invalid || !cohort) return false
      const saved = await action.run()
      if (!saved) return false
      active.refresh()
      return true
    },
    isSaving: action.isLoading,
    error: action.error,
  }
}
