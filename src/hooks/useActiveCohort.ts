'use client'

// =============================================================================
// useActiveCohort: the cohort every cohort-scoped admin screen works on.
// <ActiveCohortProvider> is mounted in src/app/admin/layout.tsx. It loads
// GET /cohorts and defaults to the newest active cohort, or the newest cohort
// when none is active. The choice is remembered in localStorage.
// =============================================================================

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { api, fetchAllPages } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import type { CohortResponse } from '@/types/cohort'

export const ACTIVE_COHORT_STORAGE_KEY = 'kamilimu_active_cohort'

export interface ActiveCohortContextValue {
  cohorts: CohortResponse[]
  cohort: CohortResponse | null
  cohortId: string | null
  isLoading: boolean
  error: string | null
  setCohortId: (id: string) => void
  // Reload the list, for example after creating or editing a cohort
  refresh: () => void
}

export const ActiveCohortContext = createContext<ActiveCohortContextValue | null>(null)

function readStoredId(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_COHORT_STORAGE_KEY)
  } catch {
    return null
  }
}

function storeId(id: string): void {
  try {
    window.localStorage.setItem(ACTIVE_COHORT_STORAGE_KEY, id)
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only
  }
}

// Newest first by start date, then by creation
function byNewest(a: CohortResponse, b: CohortResponse): number {
  return b.start_date.localeCompare(a.start_date) || b.created_at.localeCompare(a.created_at)
}

export function pickDefaultCohort(cohorts: CohortResponse[]): CohortResponse | null {
  const sorted = [...cohorts].sort(byNewest)
  return sorted.find((c) => c.status === 'active') ?? sorted[0] ?? null
}

interface ActiveCohortProviderProps {
  children: ReactNode
}

export function ActiveCohortProvider({ children }: ActiveCohortProviderProps) {
  const [cohorts, setCohorts] = useState<CohortResponse[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    fetchAllPages((page, page_size) => api.cohorts.list({ page, page_size }))
      .then((items) => {
        if (cancelled) return
        const sorted = [...items].sort(byNewest)
        setCohorts(sorted)
        setSelectedId((current) => {
          const wanted = current ?? readStoredId()
          if (wanted && sorted.some((c) => c.id === wanted)) return wanted
          return pickDefaultCohort(sorted)?.id ?? null
        })
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(errorMessage(err, "We couldn't load the cohorts."))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tick])

  const setCohortId = useCallback((id: string) => {
    setSelectedId(id)
    storeId(id)
  }, [])

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  const value = useMemo<ActiveCohortContextValue>(() => {
    const cohort = cohorts.find((c) => c.id === selectedId) ?? null
    return {
      cohorts,
      cohort,
      cohortId: cohort?.id ?? null,
      isLoading,
      error,
      setCohortId,
      refresh,
    }
  }, [cohorts, selectedId, isLoading, error, setCohortId, refresh])

  return createElement(ActiveCohortContext.Provider, { value }, children)
}

export function useActiveCohort(): ActiveCohortContextValue {
  const ctx = useContext(ActiveCohortContext)
  if (!ctx) throw new Error('useActiveCohort must be used inside <ActiveCohortProvider>')
  return ctx
}
