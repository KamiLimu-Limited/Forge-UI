'use client'

import { api } from '@/lib/api'
import type { CohortDetailResponse } from '@/types/cohort'
import { useApiQuery, type ApiQuery } from './useApiQuery'

// GET /cohorts/{id}, with enrollment counts
export function useCohortDetail(cohortId: string | null): ApiQuery<CohortDetailResponse> {
  return useApiQuery(() => api.cohorts.getById(cohortId as string), [cohortId], {
    enabled: cohortId !== null,
    fallbackError: "We couldn't load this cohort.",
  })
}
