'use client'

import { api } from '@/lib/api'
import type { CohortResponse } from '@/types/cohort'
import { useActiveCohort } from './useActiveCohort'
import { useApiQuery } from './useApiQuery'

export interface CohortOverviewRow {
  cohort: CohortResponse
  mentees: number | null
  // 0 to 1, or null when the API has no figure yet
  coreRate: number | null
}

interface UseCohortsOverviewReturn {
  rows: CohortOverviewRow[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// Every cohort with its mentee count (GET /cohorts/{id}) and average core
// attendance rate (GET /dashboard/committee/cohort-health)
export function useCohortsOverview(): UseCohortsOverviewReturn {
  const active = useActiveCohort()
  const ids = active.cohorts.map((c) => c.id).join(',')

  const query = useApiQuery(
    () =>
      Promise.all(
        active.cohorts.map(async (cohort) => {
          const [detail, health] = await Promise.all([
            api.cohorts.getById(cohort.id).catch(() => null),
            api.dashboard.cohortHealth(cohort.id).catch(() => null),
          ])
          return {
            cohort,
            mentees: detail ? (detail.enrollment_counts.mentee ?? 0) : null,
            coreRate: health && health.total_mentees > 0 ? health.average_core_rate : null,
          }
        })
      ),
    [ids],
    { enabled: !active.isLoading, fallbackError: "We couldn't load the cohorts." }
  )

  return {
    rows: query.data ?? [],
    isLoading: active.isLoading || query.isLoading,
    error: active.error ?? query.error,
    refetch: () => {
      active.refresh()
      query.refetch()
    },
  }
}
