'use client'

import { alumniCohortId, loadAlumniHome, loadAlumniRecord } from '@/lib/alumni'
import type { AlumniHomeView, AlumniRecordView } from '@/types/alumni'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useActiveView } from './useActiveView'
import { useAuth } from './useAuth'

const NO_COHORT =
  "We couldn't find your past cohort. Ask the System Admin to check your alumni role."

// The active view's cohort when it is an alumni view, otherwise the newest alumni cohort
function useAlumniCohortId(): string | null {
  const { user } = useAuth()
  const view = useActiveView()
  return view.role === 'alumni' ? view.cohortId : alumniCohortId(user)
}

export function useAlumniHome(): ApiQuery<AlumniHomeView> {
  const { user } = useAuth()
  const cohortId = useAlumniCohortId()
  return useApiQuery(
    () =>
      cohortId && user
        ? loadAlumniHome(user.first_name, cohortId)
        : Promise.reject(new Error('No alumni cohort')),
    [cohortId, user?.id],
    { fallbackError: cohortId ? "We couldn't load your record. Try again." : NO_COHORT }
  )
}

export function useAlumniRecord(): ApiQuery<AlumniRecordView> {
  const { user } = useAuth()
  const cohortId = useAlumniCohortId()
  return useApiQuery(
    () =>
      cohortId && user ? loadAlumniRecord(cohortId) : Promise.reject(new Error('No alumni cohort')),
    [cohortId, user?.id],
    { fallbackError: cohortId ? "We couldn't load your record. Try again." : NO_COHORT }
  )
}
