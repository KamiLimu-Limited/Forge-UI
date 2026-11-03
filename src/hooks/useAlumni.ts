'use client'

import { alumniCohortId, loadAlumniHome, loadAlumniRecord } from '@/lib/alumni'
import type { AlumniHomeView, AlumniRecordView } from '@/types/alumni'
import { useApiQuery, type ApiQuery } from './useApiQuery'
import { useAuth } from './useAuth'

const NO_COHORT =
  "We couldn't find your past cohort. Ask the System Admin to check your alumni role."

export function useAlumniHome(): ApiQuery<AlumniHomeView> {
  const { user } = useAuth()
  const cohortId = alumniCohortId(user)
  return useApiQuery(
    () =>
      cohortId && user
        ? loadAlumniHome(user.id, user.first_name, cohortId)
        : Promise.reject(new Error('No alumni cohort')),
    [cohortId, user?.id],
    { fallbackError: cohortId ? "We couldn't load your record. Try again." : NO_COHORT }
  )
}

export function useAlumniRecord(): ApiQuery<AlumniRecordView> {
  const { user } = useAuth()
  const cohortId = alumniCohortId(user)
  return useApiQuery(
    () =>
      cohortId && user
        ? loadAlumniRecord(user.id, cohortId)
        : Promise.reject(new Error('No alumni cohort')),
    [cohortId, user?.id],
    { fallbackError: cohortId ? "We couldn't load your record. Try again." : NO_COHORT }
  )
}
