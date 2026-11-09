'use client'

import { loadGraduationResult } from '@/lib/graduation'
import type { GraduationResultView } from '@/types/graduation'
import { useActiveView } from './useActiveView'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useAuth } from './useAuth'

// The signed-in mentee's final result for the active view's cohort. data is null until the
// cohort's graduation is final. Only the mentee themself can load it.
export function useGraduationResult(): ApiQuery<GraduationResultView | null> {
  const { user } = useAuth()
  const { cohortId } = useActiveView()
  return useApiQuery(
    () => loadGraduationResult(user?.id ?? '', user?.first_name ?? 'there', cohortId as string),
    [user?.id, cohortId],
    {
      enabled: user !== null && cohortId !== null,
      fallbackError: "We couldn't load your result. Try again.",
    }
  )
}
