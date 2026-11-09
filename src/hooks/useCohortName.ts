'use client'

import { useContext } from 'react'
import { ActiveCohortContext } from './useActiveCohort'
import { ActiveViewContext } from './useActiveView'

// The name of the cohort a committee screen shows, from whichever shell it is in
export function useCohortName(): string | null {
  const admin = useContext(ActiveCohortContext)
  const view = useContext(ActiveViewContext)
  if (admin) return admin.cohort?.name ?? null
  return view?.active?.cohortName ?? null
}
