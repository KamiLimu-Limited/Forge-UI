'use client'

import { api } from '@/lib/api'
import type { IctTrackResponse } from '@/types/cohort'
import { useApiQuery, type ApiQuery } from './useApiQuery'

// The ICT tracks a cohort offers, with each one's lead mentor
export function useCohortIctTracks(cohortId: string | null): ApiQuery<IctTrackResponse[]> {
  return useApiQuery(() => api.cohorts.ictTracks(cohortId as string), [cohortId], {
    enabled: Boolean(cohortId),
    fallbackError: "We couldn't load the ICT tracks. Try again.",
  })
}
