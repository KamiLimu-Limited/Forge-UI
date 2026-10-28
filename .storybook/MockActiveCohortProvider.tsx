import { useMemo, type ReactNode } from 'react'
import { ActiveCohortContext, type ActiveCohortContextValue } from '../src/hooks/useActiveCohort'
import type { CohortResponse } from '../src/types/cohort'

export interface ActiveCohortParameters {
  cohorts?: CohortResponse[]
  cohortId?: string | null
  isLoading?: boolean
  error?: string | null
}

interface MockActiveCohortProviderProps extends ActiveCohortParameters {
  children?: ReactNode
}

// A fixed active cohort so admin components render in Storybook without the API
export function MockActiveCohortProvider({
  cohorts = [],
  cohortId = null,
  isLoading = false,
  error = null,
  children,
}: MockActiveCohortProviderProps) {
  const value = useMemo<ActiveCohortContextValue>(() => {
    const cohort = cohorts.find((c) => c.id === cohortId) ?? null
    return {
      cohorts,
      cohort,
      cohortId: cohort?.id ?? null,
      isLoading,
      error,
      setCohortId: () => undefined,
      refresh: () => undefined,
    }
  }, [cohorts, cohortId, isLoading, error])
  return <ActiveCohortContext.Provider value={value}>{children}</ActiveCohortContext.Provider>
}
