'use client'

import { useContext } from 'react'
import { ActiveCohortContext } from './useActiveCohort'
import { ActiveViewContext } from './useActiveView'

interface OversightCohort {
  cohortId: string | null
  isLoading: boolean
}

// The cohort a committee screen shows. Inside the admin shell (the Program Lead's
// Oversight pages) that is the admin's active cohort; on /dashboard it is the active view.
export function useOversightCohort(): OversightCohort {
  const admin = useContext(ActiveCohortContext)
  const view = useContext(ActiveViewContext)
  if (admin) return { cohortId: admin.cohortId, isLoading: admin.isLoading }
  return { cohortId: view?.cohortId ?? null, isLoading: false }
}
